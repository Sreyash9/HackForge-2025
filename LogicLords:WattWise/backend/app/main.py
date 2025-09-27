from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db, close_mongo_connection
from app.routers import auth
from app.routers import energy_simple as energy
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="WattWise API", version="1.0.0", description="Smart Energy Usage Tracker API")

# Database initialization
@app.on_event("startup")
async def startup_event():
    await init_db()
    print("✅ Connected to MongoDB Atlas")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    print("✅ Disconnected from MongoDB Atlas")

# Configure CORS
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://localhost:3000",
    "https://localhost:3001",
]

# Get origins from environment variable if available
cors_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
if cors_origins and cors_origins[0]:
    allowed_origins.extend(cors_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(energy.router, prefix="/api/energy", tags=["Energy Management"])

@app.get("/")
def read_root():
    return {
        "message": "Welcome to WattWise API", 
        "version": "1.0.0",
        "database": "MongoDB Atlas",
        "status": "operational"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "mongodb"}
