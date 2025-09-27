from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum

class User(Document):
    email: Indexed(str, unique=True)
    username: Indexed(str, unique=True)
    hashed_password: str
    is_active: bool = True
    
    # New fields for Goa energy tracking
    sanctioned_load_kw: float = 5.0  # Sanctioned load in kW for fixed charge calculation
    address: Optional[str] = None
    consumer_number: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "users"
        indexes = [
            "email",
            "username",
        ]

class Room(Base):
    __tablename__ = "rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Living Room", "Master Bedroom"
    room_type = Column(String, nullable=True)  # e.g., "bedroom", "kitchen", "living_room"
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="rooms")
    appliances = relationship("Appliance", back_populates="room")

class Appliance(Base):
    __tablename__ = "appliances"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # e.g., "Air Conditioner", "Refrigerator", "TV"
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    wattage = Column(Float, nullable=False)  # Power consumption in watts
    star_rating = Column(Integer, nullable=True)  # BEE star rating (1-5)
    purchase_date = Column(DateTime(timezone=True), nullable=True)
    estimated_daily_hours = Column(Float, default=8.0)  # Default usage hours per day
    notes = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)  # For uploaded appliance images
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="appliances")
    room = relationship("Room", back_populates="appliances")
    usage_logs = relationship("UsageLog", back_populates="appliance")

class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    
    # Usage tracking fields
    log_date = Column(Date, nullable=False)  # Date of usage
    duration_hours = Column(Float, nullable=False)  # Hours used on this date
    calculated_monthly_kwh = Column(Float, nullable=True)  # Monthly kWh for this appliance
    usage_type = Column(String, default="daily")  # "daily", "monthly_average"
    
    # Legacy fields (keeping for backward compatibility)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    energy_consumed_kwh = Column(Float, nullable=True)  # Calculated: (wattage * duration) / 1000
    cost_inr = Column(Float, nullable=True)  # Cost based on Goa electricity tariff
    notes = Column(Text, nullable=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    appliance_id = Column(Integer, ForeignKey("appliances.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="usage_logs")
    appliance = relationship("Appliance", back_populates="usage_logs")

class MonthlyBill(Base):
    __tablename__ = "monthly_bills"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Bill period
    bill_month = Column(Integer, nullable=False)  # 1-12
    bill_year = Column(Integer, nullable=False)
    
    # Consumption data
    total_kwh = Column(Float, nullable=False)
    
    # Slab-wise breakdown
    slab_0_100_units = Column(Float, default=0.0)
    slab_0_100_cost = Column(Float, default=0.0)
    slab_101_200_units = Column(Float, default=0.0)
    slab_101_200_cost = Column(Float, default=0.0)
    slab_201_300_units = Column(Float, default=0.0)
    slab_201_300_cost = Column(Float, default=0.0)
    slab_301_400_units = Column(Float, default=0.0)
    slab_301_400_cost = Column(Float, default=0.0)
    slab_401_plus_units = Column(Float, default=0.0)
    slab_401_plus_cost = Column(Float, default=0.0)
    
    # Total costs
    energy_cost = Column(Float, nullable=False)  # Total EC cost
    fixed_cost = Column(Float, nullable=False)   # Total FC cost
    total_bill = Column(Float, nullable=False)   # EC + FC
    
    # AI suggestions
    ai_suggestions = Column(Text, nullable=True)  # JSON string with AI recommendations
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="monthly_bills")

class PreloadedAppliance(Base):
    """Pre-loaded appliance data with typical wattage values"""
    __tablename__ = "preloaded_appliances"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=True)
    typical_wattage_min = Column(Float, nullable=False)
    typical_wattage_max = Column(Float, nullable=False)
    typical_daily_hours = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())