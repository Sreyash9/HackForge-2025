# How the LogUsage Page Works

## Overview
The LogUsage page (`http://localhost:3000/log-usage`) is the core feature of WattWise that allows users to log their daily energy consumption and get AI-powered bill calculations and recommendations.

## Page Structure

### 1. **Header Section**
- **Title**: "Daily Energy Usage Tracker"
- **User Navigation**: Shows logged-in user with logout option
- **Search Bar**: Filter appliances by name or room

### 2. **Room-Based Appliance Display**
The page groups appliances by rooms for better organization:
- **Room Cards**: Each room shows:
  - Room name
  - Total monthly consumption estimate
  - Total monthly cost estimate
  - Highest-consuming appliance indicator
- **Appliance Grid**: Within each room:
  - Appliance name and wattage
  - Room location
  - Click to log usage

### 3. **Usage Logging Popup**
When clicking on an appliance, a popup appears with two tabs:

#### **📊 Log Usage Tab:**
- **Date Picker**: Select date for usage logging
- **Hours Input**: Enter how many hours the appliance was used
- **Real-time Calculator**: Shows:
  - Formula: (Wattage × Hours) ÷ 1000 = kWh
  - Live calculation as you type
  - Monthly total prediction
- **Log Button**: Saves the usage data

#### **📈 View History Tab:**
- **Recent History**: Shows last 10 usage entries
- **Usage Details**: Date, hours used, kWh consumed
- **View All Button**: Loads up to 50 historical entries
- **Empty State**: Shows helpful message for new appliances

### 4. **AI Bill Calculation**
The "🤖 Calculate Bill with AI Suggestions" button:
- **Analyzes**: All logged usage data
- **Calculates**: Monthly bill with Goa electricity rates
- **Shows**: Detailed slab breakdown
- **Provides**: AI-powered personalized suggestions

### 5. **Quick Stats**
At the top, displays:
- **Total Appliances**: Count of all user's appliances
- **Total Capacity**: Sum of all appliance wattages
- **Rooms**: Number of rooms added

## Technical Flow

### Data Flow:
1. **Page Load** → Fetch user rooms and appliances
2. **Group by Room** → Organize appliances by room
3. **Click Appliance** → Load usage history for that appliance
4. **Log Usage** → Save to database with calculated kWh
5. **Calculate Bill** → Process all usage logs into bill breakdown

### API Endpoints Used:
- `GET /energy/rooms` - Get user's rooms
- `GET /energy/rooms/{id}/appliances` - Get appliances per room
- `GET /energy/appliances/{id}/usage-history` - Get usage history
- `POST /energy/usage-log` - Save new usage entry
- `POST /energy/calculate-bill` - Calculate bill with AI suggestions

### Database Structure:
```
UsageLog {
  id: ObjectId
  user_id: string
  appliance_id: string
  log_date: Date
  duration_hours: number
  calculated_monthly_kwh: number
  usage_type: "daily" | "weekly" | "monthly"
}
```

## Key Features

### 1. **Real-time Calculations**
- Live kWh calculation as user types hours
- Monthly projection based on daily usage
- Cost estimation using local electricity rates

### 2. **Smart Grouping**
- Appliances organized by rooms
- Consumption analytics per room
- Highlighting of highest-consuming items

### 3. **Usage History Tracking**
- Complete history of all usage logs
- Date-wise consumption tracking
- Expandable history with "View All" option

### 4. **AI-Powered Insights**
- Personalized recommendations based on actual usage
- Bill breakdown with slab calculations
- Energy-saving tips specific to user's appliances

### 5. **User Experience**
- Responsive design for mobile/desktop
- Smooth animations with Framer Motion
- Real-time feedback and notifications
- Intuitive popup interface

## Troubleshooting Common Issues

### 1. **"Appliance-wise Consumption showing 0"**
- **Cause**: No usage logs entered yet
- **Solution**: Start logging daily usage for appliances

### 2. **"New appliances not showing"**
- **Cause**: Cache or data sync issue
- **Solution**: Refresh page or check room assignments

### 3. **"Usage history showing for new appliances"**
- **Fixed**: Now uses real API data, new appliances show empty state

### 4. **"AI suggestions too generic"**
- **Fixed**: AI now analyzes actual user appliances and usage patterns

## Usage Workflow

1. **Daily Routine**: 
   - Open LogUsage page
   - Click appliances used that day
   - Enter hours of usage
   - Log the data

2. **Weekly Review**:
   - Use "Calculate Bill" to see consumption
   - Review AI suggestions
   - Check usage history trends

3. **Monthly Analysis**:
   - Compare with previous month
   - Set goals based on insights
   - Track savings progress

This system provides comprehensive energy tracking with intelligent insights to help users reduce their electricity consumption and costs.