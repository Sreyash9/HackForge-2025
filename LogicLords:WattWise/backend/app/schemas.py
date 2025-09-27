from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List, Dict, Any

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str  # Changed from int to str for MongoDB ObjectId
    is_active: bool
    sanctioned_load_kw: float = 5.0
    address: Optional[str] = None
    consumer_number: Optional[str] = None
    previous_month_bill: Optional[float] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

# Appliance Schemas
class ApplianceBase(BaseModel):
    name: str
    category: str
    brand: Optional[str] = None
    model: Optional[str] = None
    wattage: float
    star_rating: Optional[int] = None
    purchase_date: Optional[datetime] = None
    estimated_daily_hours: float = 8.0
    room_location: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None

class ApplianceCreate(ApplianceBase):
    pass

class ApplianceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    wattage: Optional[float] = None
    star_rating: Optional[int] = None
    purchase_date: Optional[datetime] = None
    estimated_daily_hours: Optional[float] = None
    room_location: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None

class ApplianceResponse(ApplianceBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Usage Log Schemas
class UsageLogBase(BaseModel):
    start_time: datetime
    end_time: Optional[datetime] = None
    duration_hours: Optional[float] = None
    usage_type: str = "manual"
    notes: Optional[str] = None

class UsageLogCreate(UsageLogBase):
    appliance_id: str

class UsageLogUpdate(BaseModel):
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_hours: Optional[float] = None
    usage_type: Optional[str] = None
    notes: Optional[str] = None

class UsageLogResponse(UsageLogBase):
    id: str
    user_id: str
    appliance_id: str
    energy_consumed_kwh: Optional[float] = None
    cost_inr: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    appliance: ApplianceResponse
    
    class Config:
        from_attributes = True

# Preloaded Appliance Schemas
class PreloadedApplianceResponse(BaseModel):
    id: str
    category: str
    subcategory: Optional[str] = None
    typical_wattage_min: float
    typical_wattage_max: float
    typical_daily_hours: float
    description: Optional[str] = None
    
    class Config:
        from_attributes = True

# Room Schemas
class RoomBase(BaseModel):
    name: str
    room_type: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomResponse(RoomBase):
    id: str
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Enhanced Appliance Schemas
class ApplianceCreate(BaseModel):
    name: str
    category: str
    brand: Optional[str] = None
    model: Optional[str] = None
    wattage: float
    star_rating: Optional[int] = None
    estimated_daily_hours: float = 8.0
    room_id: Optional[int] = None
    notes: Optional[str] = None

class ApplianceResponse(BaseModel):
    id: str
    name: str
    category: str
    brand: Optional[str] = None
    model: Optional[str] = None
    wattage: float
    star_rating: Optional[int] = None
    estimated_daily_hours: float
    room_id: Optional[int] = None
    notes: Optional[str] = None
    user_id: str
    created_at: datetime
    room: Optional[RoomResponse] = None
    
    class Config:
        from_attributes = True

# Enhanced Usage Log Schemas
class UsageLogCreate(BaseModel):
    appliance_id: str
    log_date: date
    duration_hours: float
    usage_type: str = "daily"
    notes: Optional[str] = None

class UsageLogResponse(BaseModel):
    id: str
    appliance_id: str
    log_date: date
    duration_hours: float
    calculated_monthly_kwh: Optional[float] = None
    usage_type: str
    notes: Optional[str] = None
    created_at: datetime
    appliance: ApplianceResponse
    
    class Config:
        from_attributes = True

# Monthly Bill Schemas
class SlabBreakdown(BaseModel):
    slab: str
    units: float
    rate: float
    cost: float

class ApplianceConsumption(BaseModel):
    name: str
    monthly_kwh: float
    responsible_for_slab_rate: float
    allocated_cost: float

class BillCalculationResponse(BaseModel):
    user_id: str
    month: int
    year: int
    total_units: float
    energy_cost: float
    fixed_cost: float
    total_bill: float
    sanctioned_load_kw: float
    cost_breakdown_by_slab: List[SlabBreakdown]
    top_energy_consumers: List[ApplianceConsumption]
    ai_suggestions: str
    bill_id: str

class MonthlyBillResponse(BaseModel):
    id: str
    user_id: str
    bill_month: int
    bill_year: int
    total_kwh: float
    energy_cost: float
    fixed_cost: float
    total_bill: float
    slab_0_100_units: float
    slab_0_100_cost: float
    slab_101_200_units: float
    slab_101_200_cost: float
    slab_201_300_units: float
    slab_201_300_cost: float
    slab_301_400_units: float
    slab_301_400_cost: float
    slab_401_plus_units: float
    slab_401_plus_cost: float
    ai_suggestions: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard Schemas
class EnergyStats(BaseModel):
    total_energy_kwh: float
    total_cost_inr: float
    total_appliances: int
    average_daily_cost: float
    top_consuming_appliances: List[dict]

class DashboardResponse(BaseModel):
    user: UserResponse
    energy_stats: EnergyStats
    recent_usage: List[UsageLogResponse]