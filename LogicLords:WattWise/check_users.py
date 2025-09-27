#!/usr/bin/env python3
import sqlite3
import os

# Connect to the database
db_path = "/Users/rohitbinoj/hackforge-hackathon-/backend/hackforge.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute("SELECT id, email, username, is_active FROM users")
    users = cursor.fetchall()
    
    print("Existing users in database:")
    print("=" * 50)
    for user in users:
        print(f"ID: {user[0]}, Email: {user[1]}, Username: {user[2]}, Active: {user[3]}")
    
    conn.close()
else:
    print("Database file not found!")