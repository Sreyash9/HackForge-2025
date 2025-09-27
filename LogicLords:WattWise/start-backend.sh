#!/bin/bash
# Backend start script for WattWise

echo "🚀 Starting WattWise Backend Server..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000