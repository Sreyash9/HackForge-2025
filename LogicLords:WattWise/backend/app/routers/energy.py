"""
API endpoints for energy calculation and bill generation
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import extract
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import User, Room, Appliance, UsageLog, MonthlyBill
from app.routers.auth import get_current_user
from app.services.energy_calculator import GoaEnergyCalculator, GoaAISuggestionService
from app.schemas import (
    RoomCreate, RoomResponse,
    ApplianceCreate, ApplianceResponse,
    UsageLogCreate, UsageLogResponse,
    MonthlyBillResponse, BillCalculationResponse
)

router = APIRouter()

# Room Management Endpoints
@router.post("/rooms", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new room for the current user"""
    db_room = Room(
        name=room.name,
        room_type=room.room_type,
        user_id=current_user.id
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

@router.get("/rooms", response_model=List[RoomResponse])
def get_user_rooms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all rooms for the current user"""
    rooms = db.query(Room).filter(Room.user_id == current_user.id).all()
    return rooms

# Enhanced Appliance Management
@router.post("/appliances", response_model=ApplianceResponse)
def create_appliance(
    appliance: ApplianceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new appliance for the current user"""
    db_appliance = Appliance(
        name=appliance.name,
        category=appliance.category,
        brand=appliance.brand,
        model=appliance.model,
        wattage=appliance.wattage,
        star_rating=appliance.star_rating,
        estimated_daily_hours=appliance.estimated_daily_hours,
        room_id=appliance.room_id,
        notes=appliance.notes,
        user_id=current_user.id
    )
    db.add(db_appliance)
    db.commit()
    db.refresh(db_appliance)
    return db_appliance

@router.get("/appliances", response_model=List[ApplianceResponse])
def get_user_appliances(
    room_id: Optional[int] = Query(None, description="Filter by room ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all appliances for the current user, optionally filtered by room"""
    query = db.query(Appliance).filter(Appliance.user_id == current_user.id)
    
    if room_id:
        query = query.filter(Appliance.room_id == room_id)
    
    appliances = query.all()
    return appliances

# Usage Logging Endpoints
@router.post("/usage-logs", response_model=UsageLogResponse)
def create_usage_log(
    usage_log: UsageLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new usage log entry"""
    
    # Verify appliance belongs to current user
    appliance = db.query(Appliance).filter(
        Appliance.id == usage_log.appliance_id,
        Appliance.user_id == current_user.id
    ).first()
    
    if not appliance:
        raise HTTPException(status_code=404, detail="Appliance not found")
    
    # Calculate monthly kWh
    calculated_monthly_kwh = (appliance.wattage / 1000) * usage_log.duration_hours * 30
    
    db_usage_log = UsageLog(
        user_id=current_user.id,
        appliance_id=usage_log.appliance_id,
        log_date=usage_log.log_date,
        duration_hours=usage_log.duration_hours,
        calculated_monthly_kwh=calculated_monthly_kwh,
        usage_type=usage_log.usage_type,
        notes=usage_log.notes
    )
    
    db.add(db_usage_log)
    db.commit()
    db.refresh(db_usage_log)
    return db_usage_log

@router.get("/usage-logs", response_model=List[UsageLogResponse])
def get_usage_logs(
    appliance_id: Optional[int] = Query(None, description="Filter by appliance ID"),
    month: Optional[int] = Query(None, description="Filter by month (1-12)"),
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get usage logs for the current user"""
    query = db.query(UsageLog).filter(UsageLog.user_id == current_user.id)
    
    if appliance_id:
        query = query.filter(UsageLog.appliance_id == appliance_id)
    
    if month:
        query = query.filter(extract('month', UsageLog.log_date) == month)
    
    if year:
        query = query.filter(extract('year', UsageLog.log_date) == year)
    
    usage_logs = query.all()
    return usage_logs

# Energy Calculation Endpoints
@router.get("/calculate-bill", response_model=BillCalculationResponse)
def calculate_monthly_bill(
    month: Optional[int] = Query(None, description="Month (1-12), defaults to current month"),
    year: Optional[int] = Query(None, description="Year, defaults to current year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Calculate monthly bill with detailed breakdown and AI suggestions
    Implements: Calculate_Total_Bill_and_Breakdown(User_ID)
    """
    
    if month is None:
        month = datetime.now().month
    if year is None:
        year = datetime.now().year
    
    try:
        # Initialize calculator
        calculator = GoaEnergyCalculator(db)
        
        # Calculate bill breakdown
        bill_data = calculator.calculate_total_bill_and_breakdown(
            user_id=current_user.id,
            month=month,
            year=year
        )
        
        # Generate AI suggestions
        ai_service = GoaAISuggestionService()
        ai_suggestions = ai_service.generate_energy_saving_suggestions(bill_data)
        
        # Save to database
        bill_data["ai_suggestions"] = ai_suggestions
        monthly_bill = calculator.save_monthly_bill(bill_data)
        
        return BillCalculationResponse(
            **bill_data,
            ai_suggestions=ai_suggestions,
            bill_id=monthly_bill.id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating bill: {str(e)}")

@router.get("/monthly-bills", response_model=List[MonthlyBillResponse])
def get_monthly_bills(
    year: Optional[int] = Query(None, description="Filter by year"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get historical monthly bills for the current user"""
    query = db.query(MonthlyBill).filter(MonthlyBill.user_id == current_user.id)
    
    if year:
        query = query.filter(MonthlyBill.bill_year == year)
    
    bills = query.order_by(MonthlyBill.bill_year.desc(), MonthlyBill.bill_month.desc()).all()
    return bills

@router.get("/monthly-bills/{bill_id}", response_model=MonthlyBillResponse)
def get_monthly_bill(
    bill_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific monthly bill"""
    bill = db.query(MonthlyBill).filter(
        MonthlyBill.id == bill_id,
        MonthlyBill.user_id == current_user.id
    ).first()
    
    if not bill:
        raise HTTPException(status_code=404, detail="Bill not found")
    
    return bill

# Utility endpoints
@router.get("/energy-tariff")
def get_energy_tariff():
    """Get current Goa energy tariff structure"""
    from app.services.energy_calculator import ENERGY_CHARGE_SLABS, FIXED_CHARGE_RATE
    
    return {
        "energy_charge_slabs": ENERGY_CHARGE_SLABS,
        "fixed_charge_rate": FIXED_CHARGE_RATE,
        "currency": "INR",
        "state": "Goa",
        "tariff_type": "LTD/Domestic"
    }