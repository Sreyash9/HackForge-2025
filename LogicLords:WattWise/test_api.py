#!/usr/bin/env python3
import requests
import json
import time

# Test the API endpoints
BASE_URL = "http://127.0.0.1:8000/api"
timestamp = int(time.time())
TEST_USERNAME = f"user{timestamp}"
TEST_EMAIL = f"user{timestamp}@example.com"
TEST_PASSWORD = "testpassword123"

def test_register():
    print("Testing register endpoint...")
    data = {
        "email": TEST_EMAIL,
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        print(f"Register Status: {response.status_code}")
        print(f"Register Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Register Error: {e}")
        return False

def test_login():
    print(f"\nTesting login endpoint with username: {TEST_USERNAME}...")
    data = {
        "username": TEST_USERNAME,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login-json", json=data)
        print(f"Login Status: {response.status_code}")
        print(f"Login Response: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            return token_data.get("access_token")
        return False
    except Exception as e:
        print(f"Login Error: {e}")
        return False

def test_current_user(token):
    print("\nTesting current user endpoint...")
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/users/me", headers=headers)
        print(f"Current User Status: {response.status_code}")
        print(f"Current User Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Current User Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing WattWise API Endpoints")
    print(f"Using test user: {TEST_USERNAME}")
    print("=" * 40)
    
    # Test register with unique user
    register_success = test_register()
    
    if register_success:
        # Test login with the newly created user
        access_token = test_login()
        if access_token:
            test_current_user(access_token)
        else:
            print("\nLogin failed, cannot test current user endpoint")
    else:
        print("\nRegistration failed, cannot proceed with tests")
        
    print("\n" + "=" * 40)
    print("Test Complete")