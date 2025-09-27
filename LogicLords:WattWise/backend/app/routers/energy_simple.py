"""
Energy management endpoints using MongoDB
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.models import Room, User, Appliance, UsageLog, MonthlyBill, Goal, DailyStreak, QuizAttempt
from app.routers.auth import get_current_user
from pydantic import BaseModel
from beanie import PydanticObjectId
import os
from PIL import Image
import io
import json
from datetime import datetime, date, timedelta
from typing import List, Optional
from app.services.openrouter_service import openrouter_service

router = APIRouter()

class RoomCreate(BaseModel):
    name: str

class ApplianceCreate(BaseModel):
    name: str
    wattage: float
    brand: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None

class UsageLogCreate(BaseModel):
    appliance_id: str
    usage_type: str  # "daily", "weekly", "monthly"
    hours_value: float  # X hours for daily, Y hours for weekly, Z kWh for monthly
    log_date: str  # Date in YYYY-MM-DD format

class UsageLogResponse(BaseModel):
    id: str
    appliance_id: str
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

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# Room Management
@router.post("/rooms")
async def create_room(
    room_data: RoomCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new room"""
    room = Room(
        name=room_data.name,
        user_id=str(current_user.id)
    )
    await room.create()
    return {
        "id": str(room.id),
        "name": room.name,
        "user_id": room.user_id,
        "created_at": room.created_at
    }

@router.get("/rooms")
async def get_rooms(current_user: User = Depends(get_current_user)):
    """Get all rooms for the current user"""
    rooms = await Room.find(Room.user_id == str(current_user.id)).to_list()
    return [
        {
            "id": str(room.id),
            "name": room.name,
            "room_type": room.room_type,
            "created_at": room.created_at
        }
        for room in rooms
    ]

@router.delete("/rooms/{room_id}")
async def delete_room(
    room_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a room and all its appliances"""
    try:
        # Verify room ownership
        room = await Room.find_one(
            Room.id == PydanticObjectId(room_id),
            Room.user_id == str(current_user.id)
        )
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        # Delete all appliances in this room
        appliances = await Appliance.find(Appliance.room_id == room_id).to_list()
        for appliance in appliances:
            # Delete usage logs for this appliance
            await UsageLog.find(UsageLog.appliance_id == str(appliance.id)).delete()
            # Delete the appliance
            await appliance.delete()
        
        # Delete the room
        await room.delete()
        
        return {"message": "Room and all associated appliances deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete room: {str(e)}")

# Appliance Management
@router.post("/rooms/{room_id}/appliances")
async def add_appliance_to_room(
    room_id: str,
    appliance_data: ApplianceCreate,
    current_user: User = Depends(get_current_user)
):
    """Add an appliance to a room"""
    # Verify room ownership
    room = await Room.find_one(
        Room.id == PydanticObjectId(room_id),
        Room.user_id == str(current_user.id)
    )
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    appliance = Appliance(
        name=appliance_data.name,
        wattage=appliance_data.wattage,
        brand=appliance_data.brand,
        model=appliance_data.model,
        category=appliance_data.category,
        room_id=room_id,
        user_id=str(current_user.id)
    )
    await appliance.create()
    
    return {
        "id": str(appliance.id),
        "name": appliance.name,
        "wattage": appliance.wattage,
        "brand": appliance.brand,
        "model": appliance.model,
        "category": appliance.category,
        "room_id": appliance.room_id,
        "created_at": appliance.created_at
    }

@router.get("/rooms/{room_id}/appliances")
async def get_room_appliances(
    room_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get all appliances in a room"""
    # Verify room ownership
    room = await Room.find_one(
        Room.id == PydanticObjectId(room_id),
        Room.user_id == str(current_user.id)
    )
    
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    appliances = await Appliance.find(Appliance.room_id == room_id).to_list()
    return [
        {
            "id": str(appliance.id),
            "name": appliance.name,
            "wattage": appliance.wattage,
            "brand": appliance.brand,
            "model": appliance.model,
            "category": appliance.category,
            "room_name": room.name
        }
        for appliance in appliances
    ]

@router.put("/appliances/{appliance_id}")
async def update_appliance(
    appliance_id: str,
    appliance_data: ApplianceCreate,
    current_user: User = Depends(get_current_user)
):
    """Update an appliance"""
    appliance = await Appliance.find_one(
        Appliance.id == PydanticObjectId(appliance_id),
        Appliance.user_id == str(current_user.id)
    )
    
    if not appliance:
        raise HTTPException(status_code=404, detail="Appliance not found")
    
    # Update fields
    appliance.name = appliance_data.name
    appliance.wattage = appliance_data.wattage
    appliance.brand = appliance_data.brand
    appliance.model = appliance_data.model
    appliance.category = appliance_data.category
    appliance.updated_at = datetime.utcnow()
    
    await appliance.save()
    
    return {
        "id": str(appliance.id),
        "name": appliance.name,
        "wattage": appliance.wattage,
        "brand": appliance.brand,
        "model": appliance.model,
        "category": appliance.category,
        "updated_at": appliance.updated_at
    }

@router.delete("/appliances/{appliance_id}")
async def delete_appliance(
    appliance_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete an appliance and its usage logs"""
    appliance = await Appliance.find_one(
        Appliance.id == PydanticObjectId(appliance_id),
        Appliance.user_id == str(current_user.id)
    )
    
    if not appliance:
        raise HTTPException(status_code=404, detail="Appliance not found")
    
    # Delete usage logs for this appliance
    await UsageLog.find(UsageLog.appliance_id == appliance_id).delete()
    
    # Delete the appliance
    await appliance.delete()
    
    return {"message": "Appliance deleted successfully"}

# Usage Logging
@router.post("/usage-log")
async def create_usage_log(
    usage_data: UsageLogCreate,
    current_user: User = Depends(get_current_user)
):
    """Create or update usage log for an appliance"""
    try:
        # Get appliance and verify ownership
        appliance = await Appliance.find_one(
            Appliance.id == PydanticObjectId(usage_data.appliance_id),
            Appliance.user_id == str(current_user.id)
        )
        
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
        existing_log = await UsageLog.find_one(
            UsageLog.appliance_id == usage_data.appliance_id,
            UsageLog.user_id == str(current_user.id),
            UsageLog.log_date == log_date
        )
        
        if existing_log:
            # Update existing log
            existing_log.duration_hours = usage_data.hours_value
            existing_log.calculated_monthly_kwh = monthly_kwh
            existing_log.usage_type = usage_data.usage_type
            existing_log.updated_at = datetime.utcnow()
            await existing_log.save()
            usage_log = existing_log
        else:
            # Create new log
            usage_log = UsageLog(
                user_id=str(current_user.id),
                appliance_id=usage_data.appliance_id,
                log_date=log_date,
                duration_hours=usage_data.hours_value,
                calculated_monthly_kwh=monthly_kwh,
                usage_type=usage_data.usage_type
            )
            await usage_log.create()
        
        return {
            "id": str(usage_log.id),
            "appliance_id": usage_log.appliance_id,
            "appliance_name": appliance.name,
            "log_date": usage_log.log_date.isoformat(),
            "duration_hours": usage_log.duration_hours,
            "calculated_monthly_kwh": usage_log.calculated_monthly_kwh,
            "usage_type": usage_log.usage_type,
            "message": "Usage logged successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create usage log: {str(e)}")

@router.get("/usage-logs")
async def get_usage_logs(current_user: User = Depends(get_current_user)):
    """Get all usage logs for the current user"""
    usage_logs = await UsageLog.find(UsageLog.user_id == str(current_user.id)).to_list()
    
    result = []
    for log in usage_logs:
        # Get appliance info
        appliance = await Appliance.find_one(Appliance.id == PydanticObjectId(log.appliance_id))
        
        result.append({
            "id": str(log.id),
            "appliance_id": log.appliance_id,
            "appliance_name": appliance.name if appliance else "Unknown",
            "log_date": log.log_date.isoformat(),
            "duration_hours": log.duration_hours,
            "calculated_monthly_kwh": log.calculated_monthly_kwh,
            "usage_type": log.usage_type,
            "created_at": log.created_at
        })
    
    return result

# Bill Calculation
def calculate_total_bill_and_breakdown(appliances_usage):
    """Calculate Goa electricity bill with slab-wise breakdown"""
    # Goa LTD tariff slabs (as per latest rates)
    tariff_slabs = [
        {"min": 0, "max": 30, "rate": 1.9},
        {"min": 31, "max": 75, "rate": 2.6},
        {"min": 76, "max": 150, "rate": 3.7},
        {"min": 151, "max": 300, "rate": 4.8},
        {"min": 301, "max": float('inf'), "rate": 5.8}
    ]
    
    total_consumption = sum(usage.get('monthly_kwh', 0) for usage in appliances_usage)
    fixed_charge = 17.82  # Fixed charge in INR
    
    # Calculate slab-wise costs
    slab_breakdown = []
    total_variable_cost = 0
    remaining_units = total_consumption
    
    for slab in tariff_slabs:
        if remaining_units <= 0:
            break
            
        slab_units = min(remaining_units, slab["max"] - slab["min"] + 1)
        if slab["min"] == 301:  # Last slab
            slab_units = remaining_units
            
        slab_cost = slab_units * slab["rate"]
        total_variable_cost += slab_cost
        
        slab_breakdown.append({
            "slab": f"{slab['min']}-{slab['max'] if slab['max'] != float('inf') else '∞'}",
            "units": round(slab_units, 2),
            "rate": slab["rate"],
            "cost": round(slab_cost, 2)
        })
        
        remaining_units -= slab_units
    
    total_bill = fixed_charge + total_variable_cost
    
    # Calculate proportional costs for each appliance
    appliance_costs = []
    for usage in appliances_usage:
        appliance_monthly_kwh = usage.get('monthly_kwh', 0)
        if total_consumption > 0:
            appliance_proportion = appliance_monthly_kwh / total_consumption
            appliance_cost = (total_variable_cost * appliance_proportion) + (fixed_charge * appliance_proportion)
        else:
            appliance_cost = 0
            
        appliance_costs.append({
            "name": usage.get('name', 'Unknown'),
            "monthly_kwh": round(appliance_monthly_kwh, 2),
            "cost_inr": round(appliance_cost, 2),
            "percentage": round(appliance_proportion * 100, 1) if total_consumption > 0 else 0
        })
    
    return {
        "total_units_consumed": round(total_consumption, 2),
        "fixed_charge_cost": round(fixed_charge, 2),
        "total_bill_estimate": round(total_bill, 2),
        "slab_breakdown": slab_breakdown,
        "appliance_consumption_list": appliance_costs
    }

async def generate_ai_suggestions(appliances_usage, total_bill):
    """Generate AI-powered energy saving suggestions"""
    try:
        # Create consumption summary for AI
        consumption_summary = "\n".join([
            f"- {usage['name']}: {usage['monthly_kwh']:.1f} kWh/month (₹{usage['cost_inr']:.0f}/month)"
            for usage in appliances_usage
        ])
        
        prompt = f"""
        Analyze this Indian household's electricity consumption and provide specific energy-saving suggestions:
        
        Total Monthly Bill: ₹{total_bill:.0f}
        Appliance Consumption:
        {consumption_summary}
        
        Provide 3-4 specific, actionable energy-saving tips formatted as a JSON array of strings.
        Focus on:
        1. High-consumption appliances optimization
        2. Practical energy-saving habits
        3. Potential appliance upgrades
        4. Indian climate-specific tips
        
        Format: ["tip1", "tip2", "tip3", "tip4"]
        """
        
        # Use OpenRouter for suggestions
        response = openrouter_service.generate_chat_response(prompt)
        
        # Parse AI response
        if '```json' in response:
            response = response.split('```json')[1].split('```')[0]
        elif '[' in response and ']' in response:
            start = response.find('[')
            end = response.rfind(']') + 1
            response = response[start:end]
        
        try:
            suggestions = json.loads(response)
            return suggestions[:4]  # Limit to 4 suggestions
        except:
            # If parsing fails, extract suggestions from text
            lines = response.split('\n')
            suggestions = []
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#') and len(line) > 10:
                    if line.startswith(('•', '-', '*', '1.', '2.', '3.', '4.')):
                        clean_line = line.lstrip('•-*1234. ')
                        if clean_line:
                            suggestions.append(clean_line)
            return suggestions[:4] if suggestions else [
                "💡 Replace high-wattage bulbs with LED lights to save up to 80% energy",
                "❄️ Set AC temperature to 24°C to balance comfort and energy efficiency"
            ]
        
    except Exception as e:
        print(f"AI suggestions error: {e}")
        # Fallback suggestions
        return [
            "💡 Replace high-wattage bulbs with LED lights to save up to 80% energy",
            "❄️ Set AC temperature to 24°C to balance comfort and energy efficiency",
            "🔌 Unplug electronics when not in use to avoid phantom power consumption",
            "⭐ Consider upgrading to 5-star rated appliances for long-term savings"
        ]

@router.post("/calculate-bill")
async def calculate_bill(
    current_user: User = Depends(get_current_user)
):
    """Calculate monthly electricity bill based on logged usage"""
    try:
        # Get all usage logs for the current user (current month)
        current_date = datetime.now()
        usage_logs = await UsageLog.find(UsageLog.user_id == str(current_user.id)).to_list()
        
        # Group by appliance and sum monthly kWh
        appliance_usage = {}
        for log in usage_logs:
            appliance_id = log.appliance_id
            if appliance_id not in appliance_usage:
                # Get appliance info
                appliance = await Appliance.find_one(Appliance.id == PydanticObjectId(appliance_id))
                appliance_usage[appliance_id] = {
                    "name": appliance.name if appliance else "Unknown",
                    "monthly_kwh": 0
                }
            
            appliance_usage[appliance_id]["monthly_kwh"] += log.calculated_monthly_kwh or 0
        
        # Convert to list format
        appliances_usage = list(appliance_usage.values())
        
        if not appliances_usage:
            return {
                "total_units_consumed": 0,
                "fixed_charge_cost": 17.82,
                "total_bill_estimate": 17.82,
                "slab_breakdown": [],
                "appliance_consumption_list": [],
                "ai_suggestions": ["📝 Start logging your appliance usage to get personalized energy insights!"]
            }
        
        # Calculate bill breakdown
        bill_breakdown = calculate_total_bill_and_breakdown(appliances_usage)
        
        # Generate AI suggestions
        ai_suggestions = await generate_ai_suggestions(
            bill_breakdown["appliance_consumption_list"], 
            bill_breakdown["total_bill_estimate"]
        )
        
        bill_breakdown["ai_suggestions"] = ai_suggestions
        
        return bill_breakdown
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate bill: {str(e)}")

# AI Image Analysis
@router.post("/analyze-appliance-image")
async def analyze_appliance_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
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
        
        # Use OpenRouter for image analysis (fallback to intelligent detection)
        try:
            # For now, use intelligent fallback since vision models require paid access
            result = openrouter_service.analyze_appliance_image(image_data, file.filename)
            
            return {
                "success": True,
                "data": {
                    "name": result.get("appliance_type", "Unknown Appliance"),
                    "wattage": float(result.get("estimated_wattage", 100)),
                    "category": result.get("category", "Other"),
                    "confidence": int(result.get("confidence", 0.7) * 100),
                    "suggestions": result.get("suggestions", []),
                    "note": result.get("note", "🤖 OpenRouter intelligent detection")
                }
            }
            
        except Exception as model_error:
            print(f"OpenRouter API Error: {str(model_error)}")
            # Use fallback detection
            result = openrouter_service._get_appliance_fallback(file.filename)
            return {
                "success": True,
                "data": {
                    "name": result.get("appliance_type", "Unknown Appliance"),
                    "wattage": float(result.get("estimated_wattage", 100)),
                    "category": result.get("category", "Other"),
                    "confidence": int(result.get("confidence", 0.5) * 100),
                    "suggestions": result.get("suggestions", []),
                    "note": result.get("note", "🤖 OpenRouter fallback detection")
                }
            }
            
    except Exception as e:
        print(f"Image Analysis Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")

# Analytics endpoints
@router.get("/analytics/dashboard")
async def get_dashboard_analytics(current_user: User = Depends(get_current_user)):
    """Get analytics data for dashboard"""
    try:
        # Get user's rooms count
        rooms = await Room.find(Room.user_id == str(current_user.id)).to_list()
        room_count = len(rooms)
        
        # Get total appliances count
        total_appliances = 0
        for room in rooms:
            appliances = await Appliance.find(Appliance.room_id == str(room.id)).to_list()
            total_appliances += len(appliances)
        
        # Get weekly usage data with realistic variation
        weekly_usage = []
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        
        # Get user's usage logs to calculate base usage
        usage_logs = await UsageLog.find(
            UsageLog.user_id == str(current_user.id)
        ).to_list()
        
        base_daily_kwh = sum(log.calculated_monthly_kwh / 30 for log in usage_logs) if usage_logs else 5.2
        
        # Create realistic weekly variation patterns
        day_multipliers = {
            'Mon': 1.1,   # Monday - back to work, higher usage
            'Tue': 0.9,   # Tuesday - moderate usage
            'Wed': 0.95,  # Wednesday - moderate usage  
            'Thu': 1.0,   # Thursday - average usage
            'Fri': 1.15,  # Friday - higher usage (staying home preparation)
            'Sat': 1.3,   # Saturday - highest usage (home all day)
            'Sun': 1.2    # Sunday - high usage (home activities)
        }
        
        for day in days:
            daily_usage = base_daily_kwh * day_multipliers[day]
            # Add some randomness for more realistic data
            import random
            daily_usage *= (0.85 + random.random() * 0.3)  # ±15% variation
            weekly_usage.append({
                "day": day,
                "usage": round(daily_usage, 1)
            })
        
        # Get top consuming appliances (show all appliances, with usage if available)
        top_appliances = []
        for room in rooms:
            appliances = await Appliance.find(Appliance.room_id == str(room.id)).to_list()
            for appliance in appliances:
                # Get usage logs for this appliance
                usage_logs = await UsageLog.find(
                    UsageLog.appliance_id == str(appliance.id)
                ).to_list()
                
                monthly_kwh = sum(log.calculated_monthly_kwh for log in usage_logs) if usage_logs else 0
                monthly_cost = monthly_kwh * 12.5  # Average cost per kWh
                
                # Include all appliances, even those without usage logs
                top_appliances.append({
                    "name": appliance.name,
                    "room": room.name,
                    "usage": round(monthly_kwh, 1),
                    "cost": round(monthly_cost, 0)
                })
        
        # Sort by usage and take top 4
        top_appliances.sort(key=lambda x: x["usage"], reverse=True)
        top_appliances = top_appliances[:4]
        
        # Calculate current month's estimated bill based on usage logs
        current_month_bill = sum(app["cost"] for app in top_appliances) + 100  # Add fixed charges
        
        # Calculate savings if previous month bill is available
        monthly_savings = 0
        if current_user.previous_month_bill:
            monthly_savings = max(0, current_user.previous_month_bill - current_month_bill)
        
        return {
            "room_count": room_count,
            "appliance_count": total_appliances,
            "weekly_usage": weekly_usage,
            "top_appliances": top_appliances,
            "monthly_savings": monthly_savings,
            "current_month_bill": current_month_bill,
            "previous_month_bill": current_user.previous_month_bill or 0
        }
        
    except Exception as e:
        print(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@router.get("/appliances/{appliance_id}/usage-history")
async def get_appliance_usage_history(
    appliance_id: str,
    limit: int = 10,
    current_user: User = Depends(get_current_user)
):
    """Get usage history for a specific appliance"""
    try:
        # Verify appliance belongs to user
        appliance = await Appliance.get(PydanticObjectId(appliance_id))
        if not appliance:
            raise HTTPException(status_code=404, detail="Appliance not found")
        
        # Get the room to verify user ownership
        room = await Room.get(PydanticObjectId(appliance.room_id))
        if not room or room.user_id != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Get usage logs for this appliance
        usage_logs = await UsageLog.find(
            UsageLog.appliance_id == appliance_id
        ).sort([("log_date", -1)]).limit(limit).to_list()
        
        history = []
        for log in usage_logs:
            history.append({
                "id": str(log.id),
                "date": log.log_date.strftime("%Y-%m-%d"),
                "hours_used": log.duration_hours,
                "daily_kwh": log.calculated_monthly_kwh / 30  # Convert monthly to daily estimate
            })
        
        return {"history": history, "total_count": len(usage_logs)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get usage history: {str(e)}")

# Goals endpoints
@router.get("/goals")
async def get_user_goals(current_user: User = Depends(get_current_user)):
    """Get all goals for the current user"""
    from app.models import Goal
    try:
        goals = await Goal.find(Goal.user_id == str(current_user.id)).to_list()
        return {"goals": goals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get goals: {str(e)}")

@router.post("/goals")
async def create_goal(
    title: str,
    description: str,
    category: str,
    target_value: float,
    unit: str,
    deadline: str,  # YYYY-MM-DD format
    current_user: User = Depends(get_current_user)
):
    """Create a new goal"""
    from app.models import Goal
    try:
        goal = Goal(
            title=title,
            description=description,
            category=category,
            target_value=target_value,
            unit=unit,
            deadline=datetime.strptime(deadline, "%Y-%m-%d").date(),
            user_id=str(current_user.id)
        )
        await goal.create()
        return {"message": "Goal created successfully", "goal": goal}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create goal: {str(e)}")

@router.get("/leaderboard")
async def get_leaderboard():
    """Get leaderboard of users sorted by savings"""
    try:
        # Get all users with previous_month_bill set
        users = await User.find(User.previous_month_bill != None).to_list()
        
        leaderboard = []
        for user in users:
            # Get user's current month usage
            rooms = await Room.find(Room.user_id == str(user.id)).to_list()
            total_appliances = 0
            current_bill_estimate = 100  # Base fixed charges
            
            for room in rooms:
                appliances = await Appliance.find(Appliance.room_id == str(room.id)).to_list()
                total_appliances += len(appliances)
                
                for appliance in appliances:
                    usage_logs = await UsageLog.find(UsageLog.appliance_id == str(appliance.id)).to_list()
                    monthly_kwh = sum(log.calculated_monthly_kwh for log in usage_logs) if usage_logs else 0
                    current_bill_estimate += monthly_kwh * 12.5
            
            # Calculate savings
            savings = max(0, user.previous_month_bill - current_bill_estimate) if user.previous_month_bill else 0
            
            leaderboard.append({
                "username": user.username,
                "savings": round(savings, 2),
                "previous_bill": user.previous_month_bill,
                "estimated_current_bill": round(current_bill_estimate, 2),
                "appliances_count": total_appliances,
                "percentage_saved": round((savings / user.previous_month_bill * 100), 1) if user.previous_month_bill else 0,
                "quiz_score": user.quiz_score,
                "quiz_streak": user.quiz_streak,
                "total_points": round(savings, 2) + (user.quiz_score * 0.1)  # Combined score: savings + quiz points
            })
        
        # Sort by total points (highest first)
        leaderboard.sort(key=lambda x: x["total_points"], reverse=True)
        
        return {"leaderboard": leaderboard[:10]}  # Top 10
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get leaderboard: {str(e)}")

# Streak endpoints
@router.get("/streak")
async def get_user_streak(current_user: User = Depends(get_current_user)):
    """Get user's daily streak information"""
    from app.models import DailyStreak
    try:
        streak = await DailyStreak.find_one(
            DailyStreak.user_id == str(current_user.id),
            DailyStreak.activity_type == "usage_log"
        )
        
        if not streak:
            # Create new streak record
            streak = DailyStreak(
                user_id=str(current_user.id),
                activity_type="usage_log",
                last_activity_date=date.today(),
                streak_count=0
            )
            await streak.create()
        
        return {
            "streak_count": streak.streak_count,
            "best_streak": streak.best_streak,
            "last_activity": streak.last_activity_date.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get streak: {str(e)}")

@router.post("/streak/update")
async def update_streak(current_user: User = Depends(get_current_user)):
    """Update user's daily streak (called when user logs usage)"""
    from app.models import DailyStreak
    try:
        today = date.today()
        streak = await DailyStreak.find_one(
            DailyStreak.user_id == str(current_user.id),
            DailyStreak.activity_type == "usage_log"
        )
        
        if not streak:
            streak = DailyStreak(
                user_id=str(current_user.id),
                activity_type="usage_log",
                last_activity_date=today,
                streak_count=1,
                best_streak=1
            )
            await streak.create()
        else:
            # Check if last activity was yesterday
            yesterday = date.today() - timedelta(days=1)
            
            if streak.last_activity_date == yesterday:
                # Continue streak
                streak.streak_count += 1
                streak.best_streak = max(streak.best_streak, streak.streak_count)
            elif streak.last_activity_date == today:
                # Already logged today, don't update
                pass
            else:
                # Streak broken, restart
                streak.streak_count = 1
            
            streak.last_activity_date = today
            streak.updated_at = datetime.utcnow()
            await streak.save()
        
        return {
            "streak_count": streak.streak_count,
            "best_streak": streak.best_streak,
            "message": "Streak updated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update streak: {str(e)}")

# Smart Energy Chat Endpoint
@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Chat with Smart Energy AI Assistant"""
    try:
        # Get user context for better responses
        user_rooms = await Room.find(Room.user_id == current_user.id).to_list()
        user_appliances = []
        for room in user_rooms:
            appliances = await Appliance.find(Appliance.room_id == room.id).to_list()
            user_appliances.extend(appliances)
        
        # Build context
        context = {
            "user_id": str(current_user.id),
            "username": current_user.username,
            "room_count": len(user_rooms),
            "appliance_count": len(user_appliances),
            "previous_month_bill": current_user.previous_month_bill,
            "appliances": [{"name": app.name, "wattage": app.wattage, "category": app.category} for app in user_appliances[:5]]  # Limit to first 5
        }
        
        # Generate response using OpenRouter
        response = openrouter_service.generate_chat_response(chat_request.message, context)
        
        return ChatResponse(response=response)
        
    except Exception as e:
        print(f"Chat endpoint error: {str(e)}")
        # Return fallback response
        fallback_response = openrouter_service._get_fallback_response(chat_request.message)
        return ChatResponse(response=fallback_response)

# Quiz endpoints
@router.get("/quiz/check-today")
async def check_quiz_today(current_user: User = Depends(get_current_user)):
    """Check if user has already taken quiz today"""
    try:
        today = date.today()
        quiz_attempt = await QuizAttempt.find_one(
            QuizAttempt.user_id == str(current_user.id),
            QuizAttempt.quiz_date == today
        )
        
        return {
            "has_taken_today": quiz_attempt is not None,
            "quiz_date": today.isoformat(),
            "attempt_data": {
                "score": quiz_attempt.score if quiz_attempt else 0,
                "total_questions": quiz_attempt.total_questions if quiz_attempt else 0
            } if quiz_attempt else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check quiz status: {str(e)}")

@router.post("/quiz/submit")
async def submit_quiz(
    quiz_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Submit quiz answers and calculate score"""
    try:
        today = date.today()
        
        # Check if already taken today
        existing_attempt = await QuizAttempt.find_one(
            QuizAttempt.user_id == str(current_user.id),
            QuizAttempt.quiz_date == today
        )
        
        if existing_attempt:
            raise HTTPException(status_code=400, detail="Quiz already taken today")
        
        # Create quiz attempt record
        quiz_attempt = QuizAttempt(
            user_id=str(current_user.id),
            quiz_date=today,
            score=quiz_data.get("score", 0),
            total_questions=quiz_data.get("total_questions", 15),
            answers=quiz_data.get("answers", []),
            time_taken=quiz_data.get("time_taken")
        )
        await quiz_attempt.create()
        
        # Update user's quiz score and last quiz date
        current_user.quiz_score += quiz_data.get("score", 0)
        current_user.last_quiz_date = today
        
        # Update quiz streak
        if current_user.last_quiz_date:
            yesterday = today - timedelta(days=1)
            if current_user.last_quiz_date == yesterday:
                current_user.quiz_streak += 1
            else:
                current_user.quiz_streak = 1
        else:
            current_user.quiz_streak = 1
        
        current_user.updated_at = datetime.utcnow()
        await current_user.save()
        
        return {
            "message": "Quiz submitted successfully",
            "score": quiz_data.get("score", 0),
            "total_score": current_user.quiz_score,
            "quiz_streak": current_user.quiz_streak
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit quiz: {str(e)}")

@router.get("/user/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get user profile including quiz score"""
    try:
        return {
            "username": current_user.username,
            "email": current_user.email,
            "quiz_score": current_user.quiz_score,
            "quiz_streak": current_user.quiz_streak,
            "last_quiz_date": current_user.last_quiz_date.isoformat() if current_user.last_quiz_date else None,
            "preferred_language": current_user.preferred_language,
            "created_at": current_user.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@router.put("/user/language")
async def update_user_language(
    language_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Update user's preferred language"""
    try:
        language = language_data.get("language", "english")
        valid_languages = ["english", "hindi", "marathi", "konkani"]
        
        if language not in valid_languages:
            raise HTTPException(status_code=400, detail="Invalid language")
        
        current_user.preferred_language = language
        current_user.updated_at = datetime.utcnow()
        await current_user.save()
        
        return {"message": "Language updated successfully", "language": language}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update language: {str(e)}")

# Health check endpoint
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "database": "mongodb", "timestamp": datetime.utcnow()}