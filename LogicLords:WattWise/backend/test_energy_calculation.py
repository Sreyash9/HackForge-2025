"""
Test script to verify the Goa energy calculation system
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from services.energy_calculator import GoaEnergyCalculator
from app.database import SessionLocal

def test_slab_calculation():
    """Test just the slab calculation logic without database"""
    from services.energy_calculator import ENERGY_CHARGE_SLABS, FIXED_CHARGE_RATE
    
    def calculate_cost_breakdown(total_kwh: float):
        remaining_units = total_kwh
        cost_breakdown = []
        total_energy_cost = 0.0
        
        for slab in ENERGY_CHARGE_SLABS:
            slab_min = slab["min"]
            slab_max = slab["max"]
            rate = slab["rate"]
            
            if remaining_units <= 0:
                continue
            
            # Calculate units in this slab
            if slab_max is None:  # Last slab (401+)
                units_in_slab = remaining_units
            else:
                slab_capacity = slab_max - slab_min + 1
                units_in_slab = min(remaining_units, slab_capacity)
            
            if units_in_slab > 0:
                slab_cost = units_in_slab * rate
                total_energy_cost += slab_cost
                
                cost_breakdown.append({
                    "range": f"{slab_min}-{slab_max if slab_max else '401+'}",
                    "units": units_in_slab,
                    "rate": rate,
                    "amount": slab_cost
                })
                
                remaining_units -= units_in_slab
        
        return cost_breakdown, total_energy_cost
    
    test_cases = [
        {"consumption": 80, "sanctioned_load": 5.0, "description": "Low consumption (80 kWh)"},
        {"consumption": 150, "sanctioned_load": 5.0, "description": "Medium consumption (150 kWh)"},
        {"consumption": 250, "sanctioned_load": 7.5, "description": "High consumption (250 kWh)"},
        {"consumption": 450, "sanctioned_load": 10.0, "description": "Very high consumption (450 kWh)"},
    ]
    
    print("🔋 Testing Goa Energy Tariff Calculation System")
    print("=" * 60)
    
    for case in test_cases:
        consumption = case["consumption"]
        sanctioned_load = case["sanctioned_load"]
        description = case["description"]
        
        slab_breakdown, energy_charge = calculate_cost_breakdown(consumption)
        fixed_charge = sanctioned_load * FIXED_CHARGE_RATE
        total_bill = fixed_charge + energy_charge
        
        print(f"\n📊 {description}")
        print(f"   Consumption: {consumption} kWh")
        print(f"   Sanctioned Load: {sanctioned_load} kW")
        print(f"   Fixed Charge: ₹{fixed_charge:.2f}")
        print(f"   Energy Charge: ₹{energy_charge:.2f}")
        print(f"   Total Bill: ₹{total_bill:.2f}")
        
        print(f"   Slab Breakdown:")
        for slab in slab_breakdown:
            print(f"     • {slab['range']}: {slab['units']} units @ ₹{slab['rate']}/unit = ₹{slab['amount']:.2f}")

if __name__ == "__main__":
    test_slab_calculation()