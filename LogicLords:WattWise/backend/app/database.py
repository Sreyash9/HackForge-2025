from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "wattwise")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL environment variable is not set")

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(
        MONGODB_URL,
        tlsAllowInvalidCertificates=True,  # For development - use proper certificates in production
        serverSelectionTimeoutMS=30000
    )
    db.database = db.client[DATABASE_NAME]

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

async def init_db():
    """Initialize database with Beanie"""
    await connect_to_mongo()
    
    # Import all models
    from app.models import User, Room, Appliance, UsageLog, MonthlyBill
    
    # Initialize Beanie with the document models
    await init_beanie(
        database=db.database,
        document_models=[User, Room, Appliance, UsageLog, MonthlyBill]
    )

def get_database():
    """Get database instance"""
    return db.database