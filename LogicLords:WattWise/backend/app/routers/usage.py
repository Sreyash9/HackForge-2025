from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models import User, Appliance, UsageLog
from app.schemas import (
    UsageLogCreate, 
    UsageLogUpdate, 
    UsageLogResponse
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/usage", tags=["usage-logs"])

def calculate_energy_and_cost(appliance_wattage: float, duration_hours: float) -> tuple:
    """Calculate energy consumption and cost"""
    energy_kwh = (appliance_wattage * duration_hours) / 1000
    tariff_rate = 4.5  # INR per kWh (Goa domestic rate)
    cost_inr = energy_kwh * tariff_rate
    return round(energy_kwh, 3), round(cost_inr, 2)

@router.post("/", response_model=UsageLogResponse)
async def create_usage_log(
    usage_data: UsageLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new usage log entry"""
    # Verify appliance belongs to current user
    appliance = db.query(Appliance).filter(
        Appliance.id == usage_data.appliance_id,
        Appliance.user_id == current_user.id
    ).first()
    
    if not appliance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appliance not found"
        )
    
    # Calculate duration if end_time is provided but duration isn't
    duration_hours = usage_data.duration_hours
    if usage_data.end_time and not duration_hours:
        time_diff = usage_data.end_time - usage_data.start_time
        duration_hours = time_diff.total_seconds() / 3600
    
    # Calculate energy and cost if duration is available
    energy_kwh = None
    cost_inr = None
    if duration_hours:
        energy_kwh, cost_inr = calculate_energy_and_cost(appliance.wattage, duration_hours)
    
    usage_log = UsageLog(
        **usage_data.dict(),
        user_id=current_user.id,
        duration_hours=duration_hours,
        energy_consumed_kwh=energy_kwh,
        cost_inr=cost_inr
    )
    
    db.add(usage_log)
    db.commit()
    db.refresh(usage_log)
    
    # Load the appliance relationship
    db.refresh(usage_log, ["appliance"])
    return usage_log

@router.get("/", response_model=List[UsageLogResponse])
async def get_usage_logs(
    appliance_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage logs for the current user with optional filters"""
    query = db.query(UsageLog).filter(UsageLog.user_id == current_user.id)
    
    if appliance_id:
        # Verify appliance belongs to user
        appliance = db.query(Appliance).filter(
            Appliance.id == appliance_id,
            Appliance.user_id == current_user.id
        ).first()
        if not appliance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appliance not found"
            )
        query = query.filter(UsageLog.appliance_id == appliance_id)
    
    if start_date:
        query = query.filter(UsageLog.start_time >= start_date)
    
    if end_date:
        query = query.filter(UsageLog.start_time <= end_date)
    
    usage_logs = query.order_by(UsageLog.start_time.desc()).limit(limit).all()
    
    # Load appliance relationships
    for log in usage_logs:
        db.refresh(log, ["appliance"])
    
    return usage_logs

@router.get("/{usage_id}", response_model=UsageLogResponse)
async def get_usage_log(
    usage_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific usage log by ID"""
    usage_log = db.query(UsageLog).filter(
        UsageLog.id == usage_id,
        UsageLog.user_id == current_user.id
    ).first()
    
    if not usage_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usage log not found"
        )
    
    db.refresh(usage_log, ["appliance"])
    return usage_log

@router.put("/{usage_id}", response_model=UsageLogResponse)
async def update_usage_log(
    usage_id: int,
    usage_update: UsageLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a usage log entry"""
    usage_log = db.query(UsageLog).filter(
        UsageLog.id == usage_id,
        UsageLog.user_id == current_user.id
    ).first()
    
    if not usage_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usage log not found"
        )
    
    # Get the appliance for calculations
    appliance = db.query(Appliance).filter(Appliance.id == usage_log.appliance_id).first()
    
    # Update fields
    update_data = usage_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(usage_log, field, value)
    
    # Recalculate duration if times are updated
    if usage_log.end_time and usage_log.start_time:
        time_diff = usage_log.end_time - usage_log.start_time
        usage_log.duration_hours = time_diff.total_seconds() / 3600
    
    # Recalculate energy and cost if duration changed
    if usage_log.duration_hours:
        energy_kwh, cost_inr = calculate_energy_and_cost(appliance.wattage, usage_log.duration_hours)
        usage_log.energy_consumed_kwh = energy_kwh
        usage_log.cost_inr = cost_inr
    
    db.commit()
    db.refresh(usage_log, ["appliance"])
    return usage_log

@router.delete("/{usage_id}")
async def delete_usage_log(
    usage_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a usage log entry"""
    usage_log = db.query(UsageLog).filter(
        UsageLog.id == usage_id,
        UsageLog.user_id == current_user.id
    ).first()
    
    if not usage_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usage log not found"
        )
    
    db.delete(usage_log)
    db.commit()
    
    return {"message": "Usage log deleted successfully"}

@router.get("/stats/daily")
async def get_daily_usage_stats(
    date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get daily usage statistics"""
    target_date = date or datetime.now().date()
    start_of_day = datetime.combine(target_date, datetime.min.time())
    end_of_day = datetime.combine(target_date, datetime.max.time())
    
    # Get usage logs for the day
    usage_logs = db.query(UsageLog).filter(
        and_(
            UsageLog.user_id == current_user.id,
            UsageLog.start_time >= start_of_day,
            UsageLog.start_time <= end_of_day
        )
    ).all()
    
    total_energy = sum(log.energy_consumed_kwh or 0 for log in usage_logs)
    total_cost = sum(log.cost_inr or 0 for log in usage_logs)
    total_duration = sum(log.duration_hours or 0 for log in usage_logs)
    
    # Group by appliance
    appliance_stats = {}
    for log in usage_logs:
        if log.appliance_id not in appliance_stats:
            appliance_stats[log.appliance_id] = {
                "appliance_name": log.appliance.name,
                "energy_kwh": 0,
                "cost_inr": 0,
                "duration_hours": 0,
                "usage_count": 0
            }
        
        appliance_stats[log.appliance_id]["energy_kwh"] += log.energy_consumed_kwh or 0
        appliance_stats[log.appliance_id]["cost_inr"] += log.cost_inr or 0
        appliance_stats[log.appliance_id]["duration_hours"] += log.duration_hours or 0
        appliance_stats[log.appliance_id]["usage_count"] += 1
    
    return {
        "date": target_date.isoformat(),
        "total_energy_kwh": round(total_energy, 3),
        "total_cost_inr": round(total_cost, 2),
        "total_duration_hours": round(total_duration, 2),
        "total_usage_sessions": len(usage_logs),
        "appliance_breakdown": list(appliance_stats.values())
    }

@router.get("/stats/weekly")
async def get_weekly_usage_stats(
    start_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get weekly usage statistics"""
    if not start_date:
        # Default to current week (Monday as start)
        today = datetime.now().date()
        start_date = today - timedelta(days=today.weekday())
    
    end_date = start_date + timedelta(days=6)
    
    # Get usage logs for the week
    usage_logs = db.query(UsageLog).filter(
        and_(
            UsageLog.user_id == current_user.id,
            UsageLog.start_time >= start_date,
            UsageLog.start_time <= end_date
        )
    ).all()
    
    total_energy = sum(log.energy_consumed_kwh or 0 for log in usage_logs)
    total_cost = sum(log.cost_inr or 0 for log in usage_logs)
    
    # Group by day
    daily_stats = {}
    for log in usage_logs:
        day = log.start_time.date().isoformat()
        if day not in daily_stats:
            daily_stats[day] = {
                "energy_kwh": 0,
                "cost_inr": 0,
                "usage_count": 0
            }
        
        daily_stats[day]["energy_kwh"] += log.energy_consumed_kwh or 0
        daily_stats[day]["cost_inr"] += log.cost_inr or 0
        daily_stats[day]["usage_count"] += 1
    
    return {
        "week_start": start_date.isoformat(),
        "week_end": end_date.isoformat(),
        "total_energy_kwh": round(total_energy, 3),
        "total_cost_inr": round(total_cost, 2),
        "average_daily_cost": round(total_cost / 7, 2),
        "daily_breakdown": daily_stats
    }