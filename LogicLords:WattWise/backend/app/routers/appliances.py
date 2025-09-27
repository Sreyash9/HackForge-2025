from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Appliance, UsageLog, PreloadedAppliance
from app.schemas import (
    ApplianceCreate, 
    ApplianceUpdate, 
    ApplianceResponse,
    PreloadedApplianceResponse
)
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/preloaded", response_model=List[PreloadedApplianceResponse])
async def get_preloaded_appliances(
    category: str = None,
    db: Session = Depends(get_db)
):
    """Get preloaded appliance data with typical wattage values"""
    query = db.query(PreloadedAppliance)
    if category:
        query = query.filter(PreloadedAppliance.category.ilike(f"%{category}%"))
    return query.all()

@router.post("/", response_model=ApplianceResponse)
async def create_appliance(
    appliance_data: ApplianceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appliance for the current user"""
    appliance = Appliance(
        **appliance_data.dict(),
        user_id=current_user.id
    )
    db.add(appliance)
    db.commit()
    db.refresh(appliance)
    return appliance

@router.get("/", response_model=List[ApplianceResponse])
async def get_user_appliances(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all appliances for the current user"""
    appliances = db.query(Appliance).filter(
        Appliance.user_id == current_user.id
    ).order_by(Appliance.created_at.desc()).all()
    return appliances

@router.get("/{appliance_id}", response_model=ApplianceResponse)
async def get_appliance(
    appliance_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific appliance by ID"""
    appliance = db.query(Appliance).filter(
        Appliance.id == appliance_id,
        Appliance.user_id == current_user.id
    ).first()
    
    if not appliance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appliance not found"
        )
    
    return appliance

@router.put("/{appliance_id}", response_model=ApplianceResponse)
async def update_appliance(
    appliance_id: int,
    appliance_update: ApplianceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an appliance"""
    appliance = db.query(Appliance).filter(
        Appliance.id == appliance_id,
        Appliance.user_id == current_user.id
    ).first()
    
    if not appliance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appliance not found"
        )
    
    # Update only provided fields
    update_data = appliance_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(appliance, field, value)
    
    db.commit()
    db.refresh(appliance)
    return appliance

@router.delete("/{appliance_id}")
async def delete_appliance(
    appliance_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an appliance"""
    appliance = db.query(Appliance).filter(
        Appliance.id == appliance_id,
        Appliance.user_id == current_user.id
    ).first()
    
    if not appliance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appliance not found"
        )
    
    # Delete associated usage logs first
    db.query(UsageLog).filter(UsageLog.appliance_id == appliance_id).delete()
    
    # Delete the appliance
    db.delete(appliance)
    db.commit()
    
    return {"message": "Appliance deleted successfully"}

@router.get("/{appliance_id}/usage-estimate")
async def get_usage_estimate(
    appliance_id: int,
    hours_per_day: float = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get energy usage and cost estimate for an appliance"""
    appliance = db.query(Appliance).filter(
        Appliance.id == appliance_id,
        Appliance.user_id == current_user.id
    ).first()
    
    if not appliance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appliance not found"
        )
    
    # Use provided hours or appliance default
    daily_hours = hours_per_day or appliance.estimated_daily_hours
    
    # Calculate daily energy consumption (kWh)
    daily_kwh = (appliance.wattage * daily_hours) / 1000
    
    # Goa electricity tariff rates (simplified)
    # This should be moved to a configuration or database
    tariff_rate_per_kwh = 4.5  # INR per kWh (approximate Goa domestic rate)
    
    daily_cost = daily_kwh * tariff_rate_per_kwh
    monthly_cost = daily_cost * 30
    yearly_cost = daily_cost * 365
    
    return {
        "appliance_name": appliance.name,
        "wattage": appliance.wattage,
        "daily_hours": daily_hours,
        "daily_kwh": round(daily_kwh, 3),
        "daily_cost_inr": round(daily_cost, 2),
        "monthly_cost_inr": round(monthly_cost, 2),
        "yearly_cost_inr": round(yearly_cost, 2),
        "tariff_rate_per_kwh": tariff_rate_per_kwh
    }