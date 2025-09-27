"""
Script to populate the preloaded_appliances table with common appliance data
Run this script after database initialization to add default appliance data
"""

from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models import PreloadedAppliance

def populate_preloaded_appliances():
    """Populate the database with common appliance wattage data"""
    
    appliance_data = [
        # Kitchen Appliances
        {"category": "Refrigerator", "subcategory": "Single Door", "typical_wattage_min": 150, "typical_wattage_max": 250, "typical_daily_hours": 24, "description": "Single door refrigerator, runs continuously"},
        {"category": "Refrigerator", "subcategory": "Double Door", "typical_wattage_min": 250, "typical_wattage_max": 400, "typical_daily_hours": 24, "description": "Double door refrigerator, runs continuously"},
        {"category": "Microwave", "subcategory": "Standard", "typical_wattage_min": 800, "typical_wattage_max": 1200, "typical_daily_hours": 0.5, "description": "Standard microwave oven"},
        {"category": "Electric Stove", "subcategory": "2 Burner", "typical_wattage_min": 1500, "typical_wattage_max": 2000, "typical_daily_hours": 2, "description": "Electric cooking stove"},
        {"category": "Electric Kettle", "subcategory": "Standard", "typical_wattage_min": 1500, "typical_wattage_max": 2000, "typical_daily_hours": 0.5, "description": "Electric water kettle"},
        {"category": "Mixer Grinder", "subcategory": "Standard", "typical_wattage_min": 500, "typical_wattage_max": 750, "typical_daily_hours": 1, "description": "Kitchen mixer grinder"},
        {"category": "Dishwasher", "subcategory": "Standard", "typical_wattage_min": 1800, "typical_wattage_max": 2300, "typical_daily_hours": 1, "description": "Automatic dishwasher"},
        
        # Cooling Appliances
        {"category": "Air Conditioner", "subcategory": "1 Ton Split", "typical_wattage_min": 800, "typical_wattage_max": 1200, "typical_daily_hours": 8, "description": "1 ton split AC, varies by efficiency"},
        {"category": "Air Conditioner", "subcategory": "1.5 Ton Split", "typical_wattage_min": 1200, "typical_wattage_max": 1800, "typical_daily_hours": 8, "description": "1.5 ton split AC, varies by efficiency"},
        {"category": "Air Conditioner", "subcategory": "2 Ton Split", "typical_wattage_min": 1600, "typical_wattage_max": 2400, "typical_daily_hours": 8, "description": "2 ton split AC, varies by efficiency"},
        {"category": "Ceiling Fan", "subcategory": "Standard", "typical_wattage_min": 60, "typical_wattage_max": 80, "typical_daily_hours": 12, "description": "Standard ceiling fan"},
        {"category": "Table Fan", "subcategory": "Standard", "typical_wattage_min": 50, "typical_wattage_max": 75, "typical_daily_hours": 8, "description": "Table or pedestal fan"},
        {"category": "Air Cooler", "subcategory": "Desert Cooler", "typical_wattage_min": 150, "typical_wattage_max": 300, "typical_daily_hours": 10, "description": "Evaporative desert cooler"},
        
        # Entertainment & Electronics
        {"category": "Television", "subcategory": "32 inch LED", "typical_wattage_min": 60, "typical_wattage_max": 100, "typical_daily_hours": 6, "description": "32 inch LED TV"},
        {"category": "Television", "subcategory": "43 inch LED", "typical_wattage_min": 80, "typical_wattage_max": 120, "typical_daily_hours": 6, "description": "43 inch LED TV"},
        {"category": "Television", "subcategory": "55 inch LED", "typical_wattage_min": 100, "typical_wattage_max": 150, "typical_daily_hours": 6, "description": "55 inch LED TV"},
        {"category": "Computer", "subcategory": "Desktop", "typical_wattage_min": 200, "typical_wattage_max": 500, "typical_daily_hours": 8, "description": "Desktop computer with monitor"},
        {"category": "Laptop", "subcategory": "Standard", "typical_wattage_min": 45, "typical_wattage_max": 100, "typical_daily_hours": 8, "description": "Laptop computer"},
        {"category": "Gaming Console", "subcategory": "Standard", "typical_wattage_min": 100, "typical_wattage_max": 200, "typical_daily_hours": 4, "description": "Gaming console (PS/Xbox)"},
        {"category": "Set Top Box", "subcategory": "DTH/Cable", "typical_wattage_min": 15, "typical_wattage_max": 25, "typical_daily_hours": 6, "description": "DTH or cable set top box"},
        
        # Lighting
        {"category": "LED Bulb", "subcategory": "9W", "typical_wattage_min": 9, "typical_wattage_max": 9, "typical_daily_hours": 6, "description": "9W LED bulb"},
        {"category": "LED Bulb", "subcategory": "12W", "typical_wattage_min": 12, "typical_wattage_max": 12, "typical_daily_hours": 6, "description": "12W LED bulb"},
        {"category": "LED Bulb", "subcategory": "15W", "typical_wattage_min": 15, "typical_wattage_max": 15, "typical_daily_hours": 6, "description": "15W LED bulb"},
        {"category": "Tube Light", "subcategory": "LED 20W", "typical_wattage_min": 20, "typical_wattage_max": 20, "typical_daily_hours": 6, "description": "20W LED tube light"},
        {"category": "CFL Bulb", "subcategory": "15W", "typical_wattage_min": 15, "typical_wattage_max": 15, "typical_daily_hours": 6, "description": "15W CFL bulb"},
        
        # Laundry & Cleaning
        {"category": "Washing Machine", "subcategory": "Semi-Automatic", "typical_wattage_min": 350, "typical_wattage_max": 500, "typical_daily_hours": 1, "description": "Semi-automatic washing machine"},
        {"category": "Washing Machine", "subcategory": "Fully Automatic", "typical_wattage_min": 500, "typical_wattage_max": 800, "typical_daily_hours": 1, "description": "Fully automatic washing machine"},
        {"category": "Iron", "subcategory": "Standard", "typical_wattage_min": 1000, "typical_wattage_max": 1400, "typical_daily_hours": 0.5, "description": "Electric clothes iron"},
        {"category": "Vacuum Cleaner", "subcategory": "Standard", "typical_wattage_min": 1000, "typical_wattage_max": 1500, "typical_daily_hours": 0.5, "description": "Vacuum cleaner"},
        
        # Water & Heating
        {"category": "Water Heater", "subcategory": "Electric Geyser", "typical_wattage_min": 1500, "typical_wattage_max": 3000, "typical_daily_hours": 2, "description": "Electric water heater/geyser"},
        {"category": "Water Pump", "subcategory": "0.5 HP", "typical_wattage_min": 350, "typical_wattage_max": 400, "typical_daily_hours": 2, "description": "0.5 HP water pump"},
        {"category": "Water Pump", "subcategory": "1 HP", "typical_wattage_min": 700, "typical_wattage_max": 800, "typical_daily_hours": 2, "description": "1 HP water pump"},
        {"category": "Room Heater", "subcategory": "Electric", "typical_wattage_min": 1000, "typical_wattage_max": 2000, "typical_daily_hours": 4, "description": "Electric room heater"},
        
        # Small Appliances
        {"category": "Router", "subcategory": "WiFi Router", "typical_wattage_min": 8, "typical_wattage_max": 15, "typical_daily_hours": 24, "description": "WiFi router, runs continuously"},
        {"category": "Phone Charger", "subcategory": "Smartphone", "typical_wattage_min": 5, "typical_wattage_max": 20, "typical_daily_hours": 2, "description": "Smartphone charger"},
        {"category": "Hair Dryer", "subcategory": "Standard", "typical_wattage_min": 1200, "typical_wattage_max": 1800, "typical_daily_hours": 0.25, "description": "Hair dryer"},
        {"category": "Induction Cooktop", "subcategory": "Single Burner", "typical_wattage_min": 1200, "typical_wattage_max": 2000, "typical_daily_hours": 2, "description": "Single burner induction cooktop"},
    ]
    
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_count = db.query(PreloadedAppliance).count()
        if existing_count > 0:
            print(f"Preloaded appliances already exist ({existing_count} records). Skipping...")
            return
        
        # Add all appliance data
        for data in appliance_data:
            appliance = PreloadedAppliance(**data)
            db.add(appliance)
        
        db.commit()
        print(f"Successfully added {len(appliance_data)} preloaded appliances to the database!")
        
    except Exception as e:
        print(f"Error populating preloaded appliances: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_preloaded_appliances()