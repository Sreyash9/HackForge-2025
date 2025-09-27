"""
Database migration script to add new columns to users table
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def migrate_users_table():
    """Add new columns to users table without losing existing data"""
    
    migration_queries = [
        # Add sanctioned_load_kw column with default value
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS sanctioned_load_kw FLOAT DEFAULT 5.0;
        """,
        
        # Add address column
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS address VARCHAR;
        """,
        
        # Add consumer_number column
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS consumer_number VARCHAR;
        """,
        
        # Add updated_at column if it doesn't exist
        """
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
        """
    ]
    
    with engine.connect() as connection:
        for query in migration_queries:
            try:
                connection.execute(text(query))
                connection.commit()
                print(f"✅ Executed: {query.strip()}")
            except Exception as e:
                print(f"❌ Error executing query: {e}")
                print(f"Query: {query.strip()}")

def create_new_tables():
    """Create new tables for rooms, monthly_bills, etc."""
    from app.models import Base
    
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ All new tables created successfully")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    print("🔄 Starting database migration...")
    print("📊 Adding new columns to users table...")
    migrate_users_table()
    
    print("\n🏗️  Creating new tables...")
    create_new_tables()
    
    print("\n✅ Migration completed!")