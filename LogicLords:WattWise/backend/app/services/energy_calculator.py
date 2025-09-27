"""
Goa Electricity Tariff Calculation Service
Implements tiered pricing calculation and AI-powered suggestions for energy optimization
"""
from typing import Dict, List, Tuple, Any
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
import json
import os

from app.models import User, Appliance, UsageLog, MonthlyBill
from app.database import get_db

# Goa LTD/Domestic Tariff Structure (as per attachment)
ENERGY_CHARGE_SLABS = [
    {"min": 0, "max": 100, "rate": 1.90},
    {"min": 101, "max": 200, "rate": 2.80},
    {"min": 201, "max": 300, "rate": 3.70},
    {"min": 301, "max": 400, "rate": 4.90},
    {"min": 401, "max": float('inf'), "rate": 5.80}
]

FIXED_CHARGE_RATE = 30.0  # ₹30 per kW per month

class GoaEnergyCalculator:
    """Core calculation engine for Goa electricity tariff"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_monthly_kwh_for_appliance(self, appliance: Appliance, month: int, year: int) -> float:
        """
        Calculate monthly kWh for a specific appliance based on usage logs
        Formula: Monthly kWh = (Wattage_W/1000) × Hours × Days in Cycle (Default 30)
        """
        # Get usage logs for the month
        usage_logs = self.db.query(UsageLog).filter(
            UsageLog.appliance_id == appliance.id,
            extract('month', UsageLog.log_date) == month,
            extract('year', UsageLog.log_date) == year
        ).all()
        
        if not usage_logs:
            # If no logs, use estimated daily hours
            estimated_monthly_kwh = (appliance.wattage / 1000) * appliance.estimated_daily_hours * 30
            return estimated_monthly_kwh
        
        # Calculate based on actual usage logs
        total_hours = sum(log.duration_hours for log in usage_logs)
        monthly_kwh = (appliance.wattage / 1000) * total_hours
        
        return monthly_kwh
    
    def calculate_energy_cost_breakdown(self, total_kwh: float) -> Dict[str, Any]:
        """
        Calculate energy cost using Goa's tiered slab system with cumulative approach
        Each slab rate applies only to units within that slab range
        """
        cost_breakdown = []
        total_energy_cost = 0.0
        
        for slab in ENERGY_CHARGE_SLABS:
            slab_min = slab["min"]
            slab_max = slab["max"]
            rate = slab["rate"]
            
            # Determine units in this slab
            if total_kwh <= slab_min:
                # No units in this slab
                units_in_slab = 0.0
            elif slab_max == float('inf'):
                # Last slab - all remaining units
                units_in_slab = max(0, total_kwh - slab_min + 1)
            else:
                # Units in current slab = min(total_units, slab_max) - max(0, slab_min - 1)
                if total_kwh >= slab_max:
                    # All units in this slab
                    units_in_slab = slab_max - slab_min + 1
                else:
                    # Partial units in this slab
                    units_in_slab = max(0, total_kwh - slab_min + 1)
            
            # Calculate cost for this slab
            slab_cost = units_in_slab * rate
            total_energy_cost += slab_cost
            
            cost_breakdown.append({
                "slab": f"{slab_min}-{slab_max if slab_max != float('inf') else '401+'}",
                "units": round(units_in_slab, 2),
                "rate": rate,
                "cost": round(slab_cost, 2)
            })
        
        return {
            "cost_breakdown_by_slab": cost_breakdown,
            "total_energy_cost": total_energy_cost
        }
    
    def allocate_cost_to_appliances(self, user_id: int, month: int, year: int) -> List[Dict[str, Any]]:
        """
        Allocate total energy cost back to appliances based on their consumption order
        Critical for AI suggestions - shows which appliances push user into expensive slabs
        """
        # Get all appliances for user
        appliances = self.db.query(Appliance).filter(Appliance.user_id == user_id).all()
        
        # Calculate monthly kWh for each appliance
        appliance_consumption = []
        for appliance in appliances:
            monthly_kwh = self.calculate_monthly_kwh_for_appliance(appliance, month, year)
            if monthly_kwh > 0:
                appliance_consumption.append({
                    "appliance": appliance,
                    "monthly_kwh": monthly_kwh,
                    "cumulative_kwh": 0.0,  # Will be calculated
                    "responsible_for_slab_rate": 0.0,  # Will be calculated
                    "allocated_cost": 0.0  # Will be calculated
                })
        
        # Sort by consumption (highest first for proper cost allocation)
        appliance_consumption.sort(key=lambda x: x["monthly_kwh"], reverse=True)
        
        # Calculate cumulative consumption and determine responsible slab rates
        cumulative_total = 0.0
        for item in appliance_consumption:
            cumulative_total += item["monthly_kwh"]
            item["cumulative_kwh"] = cumulative_total
            
            # Determine which slab this appliance's consumption falls into
            for slab in ENERGY_CHARGE_SLABS:
                if cumulative_total <= slab["max"] or slab["max"] == float('inf'):
                    item["responsible_for_slab_rate"] = slab["rate"]
                    break
        
        # Allocate costs proportionally within each slab
        total_kwh = sum(item["monthly_kwh"] for item in appliance_consumption)
        energy_breakdown = self.calculate_energy_cost_breakdown(total_kwh)
        
        # Simplified cost allocation - proportional to consumption
        total_energy_cost = energy_breakdown["total_energy_cost"]
        for item in appliance_consumption:
            if total_kwh > 0:
                item["allocated_cost"] = (item["monthly_kwh"] / total_kwh) * total_energy_cost
        
        return appliance_consumption
    
    def calculate_total_bill_and_breakdown(self, user_id: int, month: int = None, year: int = None) -> Dict[str, Any]:
        """
        Main function: Calculate complete bill breakdown for a user
        Name: Calculate_Total_Bill_and_Breakdown(User_ID)
        """
        if month is None:
            month = datetime.now().month
        if year is None:
            year = datetime.now().year
        
        # Get user details
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError(f"User {user_id} not found")
        
        # Calculate total kWh for all appliances
        appliance_breakdown = self.allocate_cost_to_appliances(user_id, month, year)
        total_kwh = sum(item["monthly_kwh"] for item in appliance_breakdown)
        
        # Calculate energy cost breakdown
        energy_breakdown = self.calculate_energy_cost_breakdown(total_kwh)
        
        # Calculate fixed cost
        fixed_cost = user.sanctioned_load_kw * FIXED_CHARGE_RATE
        
        # Calculate total bill
        total_energy_cost = energy_breakdown["total_energy_cost"]
        total_bill = total_energy_cost + fixed_cost
        
        # Get top energy consumers for AI
        top_consumers = sorted(appliance_breakdown, key=lambda x: x["monthly_kwh"], reverse=True)[:5]
        
        return {
            "user_id": user_id,
            "month": month,
            "year": year,
            "total_units": total_kwh,
            "energy_cost": total_energy_cost,
            "fixed_cost": fixed_cost,
            "total_bill": total_bill,
            "sanctioned_load_kw": user.sanctioned_load_kw,
            "cost_breakdown_by_slab": energy_breakdown["cost_breakdown_by_slab"],
            "appliance_breakdown": appliance_breakdown,
            "top_energy_consumers": [
                {
                    "name": f"{item['appliance'].room.name if item['appliance'].room else 'Unknown Room'} {item['appliance'].name}" if item['appliance'].room else item['appliance'].name,
                    "monthly_kwh": item["monthly_kwh"],
                    "responsible_for_slab_rate": item["responsible_for_slab_rate"],
                    "allocated_cost": item["allocated_cost"]
                }
                for item in top_consumers
            ]
        }
    
    def save_monthly_bill(self, bill_data: Dict[str, Any]) -> MonthlyBill:
        """Save calculated bill data to database"""
        
        # Check if bill already exists
        existing_bill = self.db.query(MonthlyBill).filter(
            MonthlyBill.user_id == bill_data["user_id"],
            MonthlyBill.bill_month == bill_data["month"],
            MonthlyBill.bill_year == bill_data["year"]
        ).first()
        
        if existing_bill:
            # Update existing bill
            monthly_bill = existing_bill
        else:
            # Create new bill
            monthly_bill = MonthlyBill(
                user_id=bill_data["user_id"],
                bill_month=bill_data["month"],
                bill_year=bill_data["year"]
            )
        
        # Update bill data
        monthly_bill.total_kwh = bill_data["total_units"]
        monthly_bill.energy_cost = bill_data["energy_cost"]
        monthly_bill.fixed_cost = bill_data["fixed_cost"]
        monthly_bill.total_bill = bill_data["total_bill"]
        
        # Update slab breakdown
        for slab_data in bill_data["cost_breakdown_by_slab"]:
            slab_name = slab_data["slab"]
            if slab_name == "0-100":
                monthly_bill.slab_0_100_units = slab_data["units"]
                monthly_bill.slab_0_100_cost = slab_data["cost"]
            elif slab_name == "101-200":
                monthly_bill.slab_101_200_units = slab_data["units"]
                monthly_bill.slab_101_200_cost = slab_data["cost"]
            elif slab_name == "201-300":
                monthly_bill.slab_201_300_units = slab_data["units"]
                monthly_bill.slab_201_300_cost = slab_data["cost"]
            elif slab_name == "301-400":
                monthly_bill.slab_301_400_units = slab_data["units"]
                monthly_bill.slab_301_400_cost = slab_data["cost"]
            elif slab_name == "401+":
                monthly_bill.slab_401_plus_units = slab_data["units"]
                monthly_bill.slab_401_plus_cost = slab_data["cost"]
        
        if not existing_bill:
            self.db.add(monthly_bill)
        
        self.db.commit()
        self.db.refresh(monthly_bill)
        
        return monthly_bill


class GoaAISuggestionService:
    """AI-powered suggestion generation using Gemini API"""
    
    def __init__(self):
        # Initialize Gemini API (placeholder for now)
        pass
    
    def generate_energy_saving_suggestions(self, bill_data: Dict[str, Any]) -> str:
        """
        Generate AI-powered suggestions using Gemini API
        Function 2: AI-Powered Suggestion Generation (Gemini API Call)
        """
        
        # Check if current month is summer (March to June in Goa)
        current_month = datetime.now().month
        is_summer = current_month in [3, 4, 5, 6]
        
        # Prepare Gemini API prompt data
        gemini_input = {
            "total_units": bill_data["total_units"],
            "cost_breakdown_by_slab": bill_data["cost_breakdown_by_slab"],
            "top_energy_consumers": bill_data["top_energy_consumers"],
            "is_current_month_summer": is_summer
        }
        
        # Gemini API Prompt (as specified in requirements)
        prompt = f"""You are an expert Energy Efficiency Advisor for Goa, India. Your task is to provide personalized, prioritized energy-saving tips based on the user's consumption and the Goa LTD/Domestic tiered electricity tariff.

**Goal:** Provide 3 specific, actionable tips to reduce the next bill, prioritizing consumption that falls into the most expensive slabs (₹4.90 and ₹5.80).

**Input Data (JSON format):**
{json.dumps(gemini_input, indent=2)}

**Output Format:** Provide the response as a numbered list of 3 tips. For the tips, explicitly reference the appliance and the high tariff rate to maximize impact."""
        
        # TODO: Implement actual Gemini API call
        # For now, return mock suggestions based on the data
        suggestions = self._generate_mock_suggestions(bill_data, is_summer)
        
        return suggestions
    
    def _generate_mock_suggestions(self, bill_data: Dict[str, Any], is_summer: bool) -> str:
        """Generate mock suggestions until Gemini API is integrated"""
        
        total_units = bill_data["total_units"]
        top_consumers = bill_data["top_energy_consumers"]
        
        suggestions = []
        
        # Suggestion 1: Target highest consumer in expensive slab
        if top_consumers and total_units > 300:
            top_appliance = top_consumers[0]
            if top_appliance["responsible_for_slab_rate"] >= 4.9:
                suggestions.append(
                    f"1. **Reduce {top_appliance['name']} usage**: This appliance consumes {top_appliance['monthly_kwh']:.1f} kWh monthly, pushing you into the ₹{top_appliance['responsible_for_slab_rate']}/kWh slab. Reducing usage by just 2 hours daily could save ₹{(top_appliance['monthly_kwh'] * 0.25 * top_appliance['responsible_for_slab_rate']):.0f} monthly."
                )
        
        # Suggestion 2: Summer-specific or general efficiency tip
        if is_summer and any(consumer["name"].lower().__contains__("ac") or consumer["name"].lower().__contains__("air") for consumer in top_consumers):
            suggestions.append(
                "2. **Optimize AC temperature**: Set your AC to 24-25°C instead of lower temperatures. Each degree increase can reduce consumption by 6-8%, potentially saving ₹200-400 monthly during summer months when you're in higher tariff slabs."
            )
        else:
            suggestions.append(
                "2. **Use energy-efficient lighting**: Replace any remaining incandescent bulbs with LED bulbs. While lighting may seem minor, every unit saved keeps you in lower tariff slabs, maximizing savings."
            )
        
        # Suggestion 3: Load balancing tip
        if total_units > 400:
            suggestions.append(
                f"3. **Shift high-consumption activities**: Your total usage of {total_units:.0f} kWh puts you in the ₹5.8/kWh slab. Try to shift non-essential appliance usage to reduce monthly consumption below 400 kWh, saving ₹{((total_units - 400) * (5.8 - 4.9)):.0f} monthly."
            )
        else:
            suggestions.append(
                "3. **Monitor standby power**: Many appliances consume power even when off. Unplug devices when not in use, especially entertainment systems and phone chargers, to prevent pushing into higher tariff slabs."
            )
        
        return "\n\n".join(suggestions)