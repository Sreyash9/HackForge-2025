from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime, date

class User(Document):
    email: Indexed(str, unique=True)
    username: Indexed(str, unique=True)
    hashed_password: str
    is_active: bool = True
    
    # New fields for Goa energy tracking
    sanctioned_load_kw: float = 5.0  # Sanctioned load in kW for fixed charge calculation
    address: Optional[str] = None
    consumer_number: Optional[str] = None
    previous_month_bill: Optional[float] = None  # Previous month's electricity bill amount
    
    # Quiz and gamification fields
    quiz_score: int = 0  # Total quiz score
    last_quiz_date: Optional[date] = None  # Last date quiz was taken
    quiz_streak: int = 0  # Quiz taking streak
    preferred_language: str = "english"  # User's preferred language
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "users"

class Room(Document):
    name: str  # e.g., "Living Room", "Master Bedroom"
    room_type: Optional[str] = None  # e.g., "bedroom", "kitchen", "living_room"
    
    # Foreign keys
    user_id: str  # Reference to User document ID
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "rooms"

class Appliance(Document):
    name: str
    wattage: float  # Power consumption in watts
    brand: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None  # Fan, Bulb, AC, Geyser, TV, Refrigerator, etc.
    purchase_date: Optional[date] = None
    warranty_months: Optional[int] = None
    
    # Location
    room_id: str  # Reference to Room document ID
    user_id: str  # Reference to User document ID
    
    # Energy efficiency details
    star_rating: Optional[int] = None  # 1-5 star rating
    annual_energy_consumption: Optional[float] = None  # kWh per year
    
    # Status
    is_active: bool = True
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "appliances"

class UsageLog(Document):
    # Usage tracking fields
    log_date: date  # Date of usage
    duration_hours: float  # Hours used on this date
    calculated_monthly_kwh: Optional[float] = None  # Monthly kWh for this appliance
    usage_type: str = "daily"  # "daily", "weekly", "monthly"
    
    # Legacy fields (keeping for backward compatibility)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    energy_consumed_kwh: Optional[float] = None  # Calculated: (wattage * duration) / 1000
    cost_inr: Optional[float] = None  # Cost based on Goa electricity tariff
    notes: Optional[str] = None
    
    # Foreign keys
    user_id: str  # Reference to User document ID
    appliance_id: str  # Reference to Appliance document ID
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "usage_logs"

class MonthlyBill(Document):
    year: int
    month: int  # 1-12
    
    # Bill breakdown
    total_units_consumed: float  # Total kWh
    fixed_charge_cost: float  # Fixed charge based on sanctioned load
    variable_charge_cost: float  # Variable charge based on usage slabs
    total_bill_estimate: float  # Total estimated bill
    
    # Slab breakdown
    slab_breakdown: List[dict] = []  # List of slab details
    
    # Appliance-wise consumption
    appliance_consumption_list: List[dict] = []  # List of appliances and their consumption
    
    # AI insights
    ai_suggestions: Optional[List[str]] = None
    potential_savings: Optional[float] = None
    
    # Foreign keys
    user_id: str  # Reference to User document ID
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "monthly_bills"

class Goal(Document):
    title: str  # Goal title
    description: str  # Goal description
    category: str  # "consumption", "cost", "behavioral", "habit"
    target_value: float  # Target value (e.g., 250 for kWh, 2000 for rupees)
    current_value: float = 0.0  # Current progress
    unit: str  # "kWh", "₹", "hours", "days"
    deadline: date  # Goal deadline
    status: str = "active"  # "active", "completed", "failed"
    
    # Foreign keys
    user_id: str  # Reference to User document ID
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "goals"

class DailyStreak(Document):
    user_id: str  # Reference to User
    activity_type: str  # Type of activity (e.g., "usage_log", "goal_completion")
    streak_count: int = 0  # Current streak count
    last_activity_date: date = Field(default_factory=date.today)
    best_streak: int = 0  # Best streak ever achieved
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    class Settings:
        name = "daily_streaks"

class QuizAttempt(Document):
    user_id: str  # Reference to User
    quiz_date: date = Field(default_factory=date.today)
    score: int  # Score achieved in the quiz
    total_questions: int  # Total questions in the quiz
    answers: List[dict]  # User's answers with question and selected option
    time_taken: Optional[int] = None  # Time taken in seconds
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quiz_attempts"