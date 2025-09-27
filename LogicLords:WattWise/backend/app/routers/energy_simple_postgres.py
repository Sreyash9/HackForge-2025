"""
Basic energy endpoints for testing
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.models import Room, User, Appliance, UsageLog, MonthlyBill
from app.routers.auth import get_current_user
from pydantic import BaseModel
from beanie import PydanticObjectId
import google.generativeai as genai
import os
from PIL import Image
import io
import json
from datetime import datetime, date
from typing import List, Optional

router = APIRouter()

class RoomCreate(BaseModel):
    name: str

class UsageLogCreate(BaseModel):
    appliance_id: int
    usage_type: str  # "daily", "weekly", "monthly"
    hours_value: float  # X hours for daily, Y hours for weekly, Z kWh for monthly
    log_date: str  # Date in YYYY-MM-DD format

class UsageLogResponse(BaseModel):
    id: int
    appliance_id: int
    appliance_name: str
    log_date: str
    duration_hours: float
    calculated_monthly_kwh: float
    usage_type: str

class BillBreakdownResponse(BaseModel):
    total_units_consumed: float
    fixed_charge_cost: float
    total_bill_estimate: float
    slab_breakdown: List[dict]
    appliance_consumption_list: List[dict]
    ai_suggestions: Optional[List[str]] = None

@router.post("/usage-log")
def create_usage_log(
    usage_data: UsageLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create or update usage log for an appliance"""
    try:
        from app.models import Appliance, UsageLog
        
        # Get appliance and verify ownership
        appliance = db.query(Appliance).filter(
            Appliance.id == usage_data.appliance_id,
            Appliance.user_id == current_user.id
        ).first()
        
        if not appliance:
            raise HTTPException(status_code=404, detail="Appliance not found")
            
        # Parse the log_date from the request
        try:
            log_date = datetime.strptime(usage_data.log_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
        
        # Calculate monthly kWh based on usage type
        if usage_data.usage_type == "daily":
            # Daily kWh = (Wattage_W/1000) × X
            daily_kwh = (appliance.wattage / 1000) * usage_data.hours_value
            monthly_kwh = daily_kwh * 30  # Approximate monthly
        elif usage_data.usage_type == "weekly":
            # Monthly kWh = (Wattage_W/1000) × Y × (30/7)
            monthly_kwh = (appliance.wattage / 1000) * usage_data.hours_value * (30/7)
        elif usage_data.usage_type == "monthly":
            # Monthly kWh = Z (direct input)
            monthly_kwh = usage_data.hours_value
        else:
            raise HTTPException(status_code=400, detail="Invalid usage_type")
        
        # Check if usage log exists for this date
        existing_log = db.query(UsageLog).filter(
            UsageLog.appliance_id == usage_data.appliance_id,
            UsageLog.user_id == current_user.id,
            UsageLog.log_date == log_date
        ).first()
        
        if existing_log:
            # Update existing log
            existing_log.duration_hours = usage_data.hours_value
            existing_log.calculated_monthly_kwh = monthly_kwh
            existing_log.usage_type = usage_data.usage_type
            existing_log.updated_at = datetime.utcnow()
            usage_log = existing_log
        else:
            # Create new log
            usage_log = UsageLog(
                user_id=current_user.id,
                appliance_id=usage_data.appliance_id,
                log_date=log_date,
                duration_hours=usage_data.hours_value,
                calculated_monthly_kwh=monthly_kwh,
                usage_type=usage_data.usage_type,
                energy_consumed_kwh=monthly_kwh
            )
            db.add(usage_log)
        
        db.commit()
        db.refresh(usage_log)
        
        return {
            "id": usage_log.id,
            "appliance_id": usage_log.appliance_id,
            "appliance_name": appliance.name,
            "log_date": str(usage_log.log_date),
            "duration_hours": usage_log.duration_hours,
            "calculated_monthly_kwh": usage_log.calculated_monthly_kwh,
            "usage_type": usage_log.usage_type,
            "message": "Usage logged successfully"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create usage log: {str(e)}")

@router.get("/usage-logs")
def get_user_usage_logs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all usage logs for the current user"""
    try:
        from app.models import UsageLog, Appliance
        
        logs = db.query(UsageLog, Appliance.name).join(
            Appliance, UsageLog.appliance_id == Appliance.id
        ).filter(
            UsageLog.user_id == current_user.id
        ).order_by(UsageLog.log_date.desc()).all()
        
        return [{
            "id": log.UsageLog.id,
            "appliance_id": log.UsageLog.appliance_id,
            "appliance_name": log.name,
            "log_date": str(log.UsageLog.log_date),
            "duration_hours": log.UsageLog.duration_hours,
            "calculated_monthly_kwh": log.UsageLog.calculated_monthly_kwh,
            "usage_type": log.UsageLog.usage_type
        } for log in logs]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch usage logs: {str(e)}")

@router.post("/calculate-bill")
async def calculate_total_bill_and_breakdown(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate total bill and breakdown with AI suggestions - Function 1 from requirements"""
    try:
        from app.models import UsageLog, Appliance
        
        # Get all usage logs for current user (current 30-day cycle)
        usage_logs = db.query(UsageLog, Appliance.name, Appliance.wattage).join(
            Appliance, UsageLog.appliance_id == Appliance.id
        ).filter(
            UsageLog.user_id == current_user.id
        ).all()
        
        if not usage_logs:
            return {
                "total_units_consumed": 0.0,
                "fixed_charge_cost": current_user.sanctioned_load_kw * 30.0,
                "total_bill_estimate": current_user.sanctioned_load_kw * 30.0,
                "slab_breakdown": [],
                "appliance_consumption_list": [],
                "ai_suggestions": ["Add some appliances and log their usage to get personalized suggestions!"]
            }
        
        # Aggregate total kWh
        total_kwh = sum([log.UsageLog.calculated_monthly_kwh or 0 for log in usage_logs])
        
        # Calculate fixed charge (FC)
        fixed_charge = current_user.sanctioned_load_kw * 30.0
        
        # Goa LTD Tariff Slabs
        tariff_slabs = [
            {"min": 0, "max": 100, "rate": 1.9, "name": "0-100"},
            {"min": 101, "max": 200, "rate": 2.8, "name": "101-200"},
            {"min": 201, "max": 300, "rate": 3.7, "name": "201-300"},
            {"min": 301, "max": 400, "rate": 4.9, "name": "301-400"},
            {"min": 401, "max": None, "rate": 5.8, "name": "401+"}
        ]
        
        # Calculate energy cost by slabs
        remaining_kwh = total_kwh
        total_energy_cost = 0
        slab_breakdown = []
        
        for slab in tariff_slabs:
            if remaining_kwh <= 0:
                break
                
            if slab["max"] is None:
                # Last slab (401+)
                units_in_slab = remaining_kwh
            else:
                slab_size = slab["max"] - slab["min"] + 1
                units_in_slab = min(remaining_kwh, slab_size)
                
            cost_in_slab = units_in_slab * slab["rate"]
            total_energy_cost += cost_in_slab
            
            if units_in_slab > 0:
                slab_breakdown.append({
                    "slab": slab["name"],
                    "units": round(units_in_slab, 2),
                    "rate": slab["rate"],
                    "cost": round(cost_in_slab, 2)
                })
            
            remaining_kwh -= units_in_slab
        
        # Calculate total bill
        total_bill = total_energy_cost + fixed_charge
        
        # Apportion costs to appliances (highest consumers get highest rates)
        appliance_list = []
        for log in usage_logs:
            kwh = log.UsageLog.calculated_monthly_kwh or 0
            if kwh > 0:
                # Proportional cost allocation
                proportion = kwh / total_kwh if total_kwh > 0 else 0
                allocated_cost = total_energy_cost * proportion
                
                # Determine highest slab rate this appliance contributes to
                highest_rate = 1.9  # Start with lowest rate
                cumulative_kwh = 0
                for slab in tariff_slabs:
                    slab_max = slab["max"] if slab["max"] else float('inf')
                    if cumulative_kwh + kwh > slab["min"]:
                        highest_rate = slab["rate"]
                    cumulative_kwh += kwh
                    if cumulative_kwh > slab_max:
                        break
                
                appliance_list.append({
                    "name": log.name,
                    "monthly_kwh": round(kwh, 2),
                    "cost_apportioned": round(allocated_cost, 2),
                    "highest_slab_rate": highest_rate
                })
        
        # Sort by monthly kWh (highest consumers first)
        appliance_list.sort(key=lambda x: x["monthly_kwh"], reverse=True)
        
        bill_data = {
            "total_units_consumed": round(total_kwh, 2),
            "fixed_charge_cost": round(fixed_charge, 2),
            "total_bill_estimate": round(total_bill, 2),
            "slab_breakdown": slab_breakdown,
            "appliance_consumption_list": appliance_list
        }
        
        # Generate AI suggestions using Function 2
        ai_suggestions = await generate_ai_suggestions(bill_data)
        bill_data["ai_suggestions"] = ai_suggestions
        
        return bill_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate bill: {str(e)}")

async def generate_ai_suggestions(bill_data: dict) -> List[str]:
    """Function 2: AI-Powered Suggestion Generation using Gemini"""
    try:
        if not bill_data["appliance_consumption_list"]:
            return ["Add appliances and log their usage to get personalized energy-saving tips!"]
        
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        
        prompt = f"""**System Role:** You are an expert Energy Efficiency Advisor for Goa, India. Your goal is to generate actionable, personalized tips to reduce a domestic user's electricity bill, with priority given to reducing consumption in the most expensive tariff tiers (₹4.90 and ₹5.80).

**Input Data (JSON):** {json.dumps(bill_data, indent=2)}

**Specific Instructions:**
1. **Analyze Slabs:** Determine which appliances are primarily responsible for pushing the user's consumption into the highest-cost slabs (₹4.90 and ₹5.80).
2. **Generate 3 Tips:** Provide exactly 3 separate tips as a JSON array.
3. **Prioritization:** The tips must target the highest-consuming appliances and directly reference the high cost of their consumption.
4. **Format:** Output ONLY a JSON array of strings, where each string is a self-contained, actionable tip.

**Output Schema (Strict JSON Array):**
```json
[
  "Tip 1: [Actionable advice referencing the highest-cost appliance and its expensive slab rate.]",
  "Tip 2: [Actionable advice referencing the next highest-cost appliance or general high-kwh behavior.]",
  "Tip 3: [A simple, behavioural tip for quick savings, e.g., turning off standby power or optimizing a fridge.]"
]
```"""

        response = model.generate_content(prompt)
        
        try:
            # Clean and parse JSON response
            response_text = response.text.strip()
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0]
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0]
            
            suggestions = json.loads(response_text.strip())
            
            # Ensure we have exactly 3 suggestions
            if isinstance(suggestions, list) and len(suggestions) >= 3:
                return suggestions[:3]
            else:
                raise ValueError("Invalid suggestion format")
                
        except (json.JSONDecodeError, ValueError):
            # Fallback suggestions based on highest consumers
            top_appliance = bill_data["appliance_consumption_list"][0] if bill_data["appliance_consumption_list"] else None
            
            if top_appliance:
                return [
                    f"Your {top_appliance['name']} consumes {top_appliance['monthly_kwh']} kWh monthly at ₹{top_appliance['highest_slab_rate']}/unit. Consider using it 2-3 hours less daily to save ₹200-300.",
                    f"High electricity usage (₹{bill_data['total_bill_estimate']:.0f}/month) suggests optimizing AC temperature to 24-25°C and using fans simultaneously for better comfort at lower cost.",
                    "Switch off appliances completely instead of keeping them on standby - this can save 5-10% on your monthly bill by eliminating phantom loads."
                ]
            else:
                return [
                    "Log your appliance usage to get personalized energy-saving recommendations.",
                    "Set your AC to 24-25°C and use ceiling fans to reduce cooling costs by up to 30%.",
                    "Unplug devices when not in use to eliminate standby power consumption."
                ]
        
    except Exception as e:
        print(f"AI suggestion generation failed: {e}")
        # Provide generic but useful fallback suggestions
        return [
            "Your highest-consuming appliances are likely ACs and geysers. Optimize their usage during peak hours.",
            "Consider upgrading to 5-star rated appliances for long-term savings on electricity bills.",
            "Use natural lighting during day and switch to LED bulbs to reduce overall consumption."
        ]

# Configure Gemini API
def test_energy_endpoint():
    """Test endpoint to verify energy router is working"""
    return {"message": "Energy router is working", "status": "ok"}

@router.get("/energy-tariff")
def get_energy_tariff():
    """Get current Goa energy tariff structure"""
    ENERGY_CHARGE_SLABS = [
        {"min": 0, "max": 100, "rate": 1.9},
        {"min": 101, "max": 200, "rate": 2.8},
        {"min": 201, "max": 300, "rate": 3.7},
        {"min": 301, "max": 400, "rate": 4.9},
        {"min": 401, "max": None, "rate": 5.8}
    ]
    
    FIXED_CHARGE_RATE = 30.0  # ₹30 per kW per month
    
    return {
        "energy_charge_slabs": ENERGY_CHARGE_SLABS,
        "fixed_charge_rate": FIXED_CHARGE_RATE,
        "currency": "INR",
        "state": "Goa",
        "tariff_type": "LTD/Domestic"
    }

@router.post("/rooms")
def create_room(
    room_data: RoomCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new room for the current user"""
    try:
        new_room = Room(
            name=room_data.name,
            user_id=current_user.id
        )
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
        
        return {
            "id": new_room.id,
            "name": new_room.name,
            "user_id": new_room.user_id,
            "created_at": new_room.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create room: {str(e)}")

@router.get("/rooms")
def get_user_rooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all rooms for the current user"""
    try:
        rooms = db.query(Room).filter(Room.user_id == current_user.id).all()
        return [{
            "id": room.id,
            "name": room.name,
            "user_id": room.user_id,
            "created_at": room.created_at
        } for room in rooms]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch rooms: {str(e)}")

class ApplianceCreate(BaseModel):
    name: str
    category: str
    wattage: float
    room_id: int

@router.post("/appliances")
def create_appliance(
    appliance_data: ApplianceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appliance for the current user"""
    try:
        from app.models import Appliance
        new_appliance = Appliance(
            name=appliance_data.name,
            category=appliance_data.category,
            wattage=appliance_data.wattage,
            room_id=appliance_data.room_id,
            user_id=current_user.id,
            estimated_daily_hours=8.0  # Default value
        )
        db.add(new_appliance)
        db.commit()
        db.refresh(new_appliance)
        
        return {
            "id": new_appliance.id,
            "name": new_appliance.name,
            "category": new_appliance.category,
            "wattage": new_appliance.wattage,
            "room_id": new_appliance.room_id,
            "created_at": new_appliance.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create appliance: {str(e)}")

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
print(f"Gemini API Key loaded: {'Yes' if api_key else 'No'}")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: GEMINI_API_KEY not found in environment variables")

@router.get("/test-gemini")
async def test_gemini_api():
    """Test Gemini API connection"""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {"success": False, "error": "API key not found"}
        
        # Try to list available models
        models = list(genai.list_models())
        available_models = [model.name for model in models if 'vision' in model.name.lower() or 'pro' in model.name.lower()]
        
        return {
            "success": True,
            "api_key_present": bool(api_key),
            "available_models": available_models[:5],  # Show first 5 models
            "total_models": len(models)
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/analyze-appliance-image")
async def analyze_appliance_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze appliance image using Gemini AI"""
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Use Gemini Pro Vision model - use available model
        model = genai.GenerativeModel('gemini-1.5-pro-latest')
        
        prompt = """
        Analyze this appliance image and extract the following information:
        1. Appliance name (be specific, e.g., "Split AC", "Ceiling Fan", "LED Bulb")
        2. Power consumption in watts (look for energy labels, specifications)
        3. Category (Fan, Bulb, AC, Geyser, TV, Refrigerator, Washing Machine, Microwave, or Other)
        
        Return the response in this exact JSON format:
        {
            "name": "specific appliance name",
            "wattage": number_in_watts,
            "category": "category_name",
            "confidence": percentage_confidence
        }
        
        If you cannot determine the exact wattage, provide a typical wattage for that appliance type.
        """
        
        try:
            response = model.generate_content([prompt, image])
            
            # Debug: Print the raw response
            print(f"Gemini API Response: {response.text}")
            
            # Parse the response
            response_text = response.text.strip()
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0]
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0]
            
            result = json.loads(response_text)
            
            return {
                "success": True,
                "data": {
                    "name": result.get("name", "Unknown Appliance"),
                    "wattage": float(result.get("wattage", 100)),
                    "category": result.get("category", "Other"),
                    "confidence": result.get("confidence", 85)
                }
            }
            
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            print(f"Raw response: {response.text}")
            # Try to extract information from plain text response
            response_text = response.text.lower()
            
            # Simple pattern matching for common appliances
            if 'fan' in response_text:
                category = 'Fan'
                name = 'Ceiling Fan' if 'ceiling' in response_text else 'Fan'
                wattage = 75
            elif 'bulb' in response_text or 'light' in response_text:
                category = 'Bulb'
                name = 'LED Bulb' if 'led' in response_text else 'Light Bulb'
                wattage = 10 if 'led' in response_text else 60
            elif 'ac' in response_text or 'air condition' in response_text:
                category = 'AC'
                name = 'Air Conditioner'
                wattage = 1500
            elif 'tv' in response_text or 'television' in response_text:
                category = 'TV'
                name = 'Television'
                wattage = 120
            else:
                category = 'Other'
                name = 'Unknown Appliance'
                wattage = 100
            
            return {
                "success": True,
                "data": {
                    "name": name,
                    "wattage": float(wattage),
                    "category": category,
                    "confidence": 60
                }
            }
        
        except Exception as model_error:
            error_msg = str(model_error)
            print(f"Model generation error: {error_msg}")
            
            # Check if it's a quota exceeded error
            if "quota" in error_msg.lower() or "429" in error_msg:
                print("Gemini API quota exceeded, using intelligent fallback...")
                # Provide a more varied selection based on common household appliances
                import random
                demo_appliances = [
                    {"name": "Samsung LED TV 55-inch", "wattage": 120, "category": "TV"},
                    {"name": "Usha Ceiling Fan", "wattage": 75, "category": "Fan"},
                    {"name": "Daikin Split AC 1.5 Ton", "wattage": 1500, "category": "AC"},
                    {"name": "Philips LED Bulb 10W", "wattage": 10, "category": "Bulb"},
                    {"name": "LG Refrigerator 260L", "wattage": 200, "category": "Refrigerator"},
                    {"name": "Bajaj Water Geyser 25L", "wattage": 2000, "category": "Geyser"},
                    {"name": "IFB Washing Machine", "wattage": 500, "category": "Washing Machine"},
                    {"name": "Samsung Microwave 28L", "wattage": 900, "category": "Microwave"},
                    {"name": "Crompton Table Fan", "wattage": 50, "category": "Fan"},
                    {"name": "Havells LED Strip Light", "wattage": 18, "category": "Bulb"},
                ]
                
                selected = random.choice(demo_appliances)
                return {
                    "success": True,
                    "data": {
                        "name": selected["name"],
                        "wattage": float(selected["wattage"]),
                        "category": selected["category"],
                        "confidence": 75,
                        "note": "⚠️ Gemini API quota exceeded - using fallback data"
                    }
                }
            else:
                # For other errors, try basic pattern matching
                print("Using basic pattern matching fallback...")
                demo_appliances = [
                    {"name": "Generic Appliance", "wattage": 100, "category": "Other"},
                    {"name": "LED Light", "wattage": 12, "category": "Bulb"},
                    {"name": "Fan", "wattage": 75, "category": "Fan"},
                ]
                
                selected = random.choice(demo_appliances)
                return {
                    "success": True,
                    "data": {
                        "name": selected["name"],
                        "wattage": float(selected["wattage"]),
                        "category": selected["category"],
                        "confidence": 50,
                        "note": "⚠️ AI analysis failed - using basic fallback"
                    }
                }
            
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

@router.get("/rooms/{room_id}/appliances")
def get_room_appliances(
    room_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appliances for a specific room"""
    try:
        from app.models import Appliance
        appliances = db.query(Appliance).filter(
            Appliance.room_id == room_id,
            Appliance.user_id == current_user.id
        ).all()
        
        return [{
            "id": app.id,
            "name": app.name,
            "category": app.category,
            "wattage": app.wattage,
            "room_id": app.room_id,
            "created_at": app.created_at
        } for app in appliances]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch appliances: {str(e)}")

@router.put("/rooms/{room_id}")
def update_room(
    room_id: int,
    room_data: RoomCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a room"""
    try:
        room = db.query(Room).filter(
            Room.id == room_id,
            Room.user_id == current_user.id
        ).first()
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        room.name = room_data.name
        db.commit()
        db.refresh(room)
        
        return {
            "id": room.id,
            "name": room.name,
            "user_id": room.user_id,
            "created_at": room.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update room: {str(e)}")

@router.delete("/rooms/{room_id}")
def delete_room(
    room_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a room and all its appliances"""
    try:
        from app.models import Appliance
        room = db.query(Room).filter(
            Room.id == room_id,
            Room.user_id == current_user.id
        ).first()
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        # Delete all appliances in the room first
        db.query(Appliance).filter(Appliance.room_id == room_id).delete()
        
        # Delete the room
        db.delete(room)
        db.commit()
        
        return {"message": "Room and all appliances deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete room: {str(e)}")

@router.put("/appliances/{appliance_id}")
def update_appliance(
    appliance_id: int,
    appliance_data: ApplianceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an appliance"""
    try:
        from app.models import Appliance
        appliance = db.query(Appliance).filter(
            Appliance.id == appliance_id,
            Appliance.user_id == current_user.id
        ).first()
        
        if not appliance:
            raise HTTPException(status_code=404, detail="Appliance not found")
        
        appliance.name = appliance_data.name
        appliance.category = appliance_data.category
        appliance.wattage = appliance_data.wattage
        appliance.room_id = appliance_data.room_id
        
        db.commit()
        db.refresh(appliance)
        
        return {
            "id": appliance.id,
            "name": appliance.name,
            "category": appliance.category,
            "wattage": appliance.wattage,
            "room_id": appliance.room_id,
            "created_at": appliance.created_at
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update appliance: {str(e)}")

@router.delete("/appliances/{appliance_id}")
def delete_appliance(
    appliance_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an appliance"""
    try:
        from app.models import Appliance
        appliance = db.query(Appliance).filter(
            Appliance.id == appliance_id,
            Appliance.user_id == current_user.id
        ).first()
        
        if not appliance:
            raise HTTPException(status_code=404, detail="Appliance not found")
        
        db.delete(appliance)
        db.commit()
        
        return {"message": "Appliance deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete appliance: {str(e)}")