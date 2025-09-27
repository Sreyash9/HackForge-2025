# WattWise - Smart Energy Usage Tracker 💡⚡

A comprehensive full-stack energy management platform with FastAPI backend, React frontend, and MongoDB Atlas, designed to help users monitor their energy consumption, track appliance usage, and reduce electricity costs through intelligent AI-powered insights.

## 🌟 Overview

WattWise empowers users to take complete control of their energy consumption through:
- **🏠 Room-Based Organization**: Organize appliances by rooms with consumption analytics
- **📊 Real-time Energy Monitoring**: Track appliance usage with detailed consumption patterns
- **💰 Cost Analysis & Savings**: Track monthly savings compared to previous bills
- **🤖 AI Energy Assistant**: Smart chatbot for instant energy advice and recommendations
- **📈 Interactive Analytics**: Beautiful graphs showing weekly usage and top consumers
- **📱 Modern Responsive UI**: Professional dashboard with animations and real-time data

## 🚀 Features

### 🎯 **NEW MAJOR FEATURES**
- 🤖 **AI Energy Chatbot**: Integrated Gemini AI assistant for instant energy advice
- 📊 **Real Analytics Dashboard**: Live data graphs for usage, savings, and consumption
- 🏠 **Room-Based Management**: Organize and track appliances by rooms
- 💰 **Savings Tracker**: Compare current usage with previous month's bills
- 📈 **Usage History**: Detailed appliance usage logs with consumption patterns
- 🎨 **Enhanced UI/UX**: Modern animations and interactive components

### Backend (FastAPI)
- ✅ **User Authentication**: JWT-based secure authentication system
- ✅ **MongoDB Atlas**: Cloud database with Beanie ODM for async operations
- ✅ **Security**: bcrypt password hashing with token verification
- ✅ **API Documentation**: Comprehensive Swagger UI documentation
- ✅ **Room & Appliance Management**: Full CRUD operations with relationships
- ✅ **Usage Analytics**: Real-time consumption tracking and bill calculations
- ✅ **AI Integration**: Google Gemini API for intelligent recommendations
- ✅ **Environment Configuration**: Secure .env-based configuration

### Frontend (React + TypeScript)
- ✅ **Modern Stack**: React 18 + TypeScript + shadcn/ui components
- ✅ **Authentication**: Protected routes with JWT token management
- ✅ **Beautiful UI**: Tailwind CSS with gradient themes and animations
- ✅ **Framer Motion**: Smooth page transitions and interactive elements
- ✅ **Responsive Design**: Mobile-first approach with adaptive layouts
- ✅ **Real-time Data**: Live dashboard updates with consumption analytics
- ✅ **Smart Energy Chatbot**: Floating AI assistant for instant help

## ⚡ Quick Start

### Prerequisites
- **Python 3.12+**
- **Node.js 16+** and **npm**
- **Git**
- **MongoDB Atlas Account** (free tier available)

### 🚀 Quick Setup

1. **Clone and navigate to the project**:
   ```bash
   git clone https://github.com/rohitbinoj/hackforge-hackathon-.git
   cd hackforge-hackathon-
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Set up environment variables (MongoDB URL, API keys)
   cp .env.example .env  # Edit with your MongoDB Atlas connection string
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Access the Application**:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://127.0.0.1:8000
   - **API Documentation**: http://127.0.0.1:8000/docs

## 🔋 Core Functionality

### Phase 1: Appliance Setup ("Smart" Input)
- **Room Creation**: Users organize appliances by rooms
- **Add Appliance Form**: Name, Category, Wattage input
- **Scan Label Feature**: AI-powered wattage extraction from appliance labels
- **Default Wattage Database**: Pre-populated values for common appliances

### Phase 2: Usage Logging
- **Daily Log**: Record "Used for X hours on [Date]"
- **Monthly Average**: Enter average usage per day/week
- **Automatic Calculation**: Converts usage to monthly kWh using formula:
  ```
  Monthly kWh = (Wattage_W/1000) × Hours × Days in Cycle (Default 30)
  ```

### Phase 3: Goa Tariff Calculation
- **Tiered Cost Allocation**: Implements Goa's 5-slab energy pricing
- **Bill Breakdown**: Shows cost contribution by slab and appliance
- **Fixed Charge**: Automatic calculation based on sanctioned load
- **AI Suggestions**: Personalized energy-saving recommendations targeting expensive slabs

## 💡 Goa Energy Tariff Structure

| Slab | Units (kWh) | Rate (₹/kWh) |
|------|-------------|--------------|
| 1    | 0 - 100     | 1.9          |
| 2    | 101 - 200   | 2.8          |
| 3    | 201 - 300   | 3.7          |
| 4    | 301 - 400   | 4.9          |
| 5    | 401+        | 5.8          |

**Fixed Charge**: ₹30 per kW per month

## 📦 Detailed Setup

Before you begin, ensure you have the following installed:
- **Python 3.12** (recommended for best compatibility)
- **Node.js 16+** and **npm**
- **Git**
- **MongoDB Atlas** (cloud database service)

## 🛠️ Installation & Setup

### Option 1: Automated Setup (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd hackforge-hackathon-
   ```

2. **Run the setup script**:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create Python virtual environment**:
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env file with your database URL and API keys
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Backend will be available at:**
- API: `http://127.0.0.1:8000`
- **Swagger UI Documentation: `http://127.0.0.1:8000/docs`**
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

### Start Frontend Server

```bash
cd frontend
npm start
```

**Frontend will be available at:** `http://localhost:3000`

## 📖 API Documentation

### Swagger UI
Access the interactive API documentation at: `http://127.0.0.1:8000/docs`

This provides:
- Interactive API testing
- Request/response schemas
- Authentication token testing
- Complete endpoint documentation

### Available Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/token` - OAuth2 token login
- `GET /api/users/me` - Get current user profile
- `GET /` - Health check

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/hackforge_db
# For Neon DB: postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/hackforge_db

# JWT
SECRET_KEY=your-super-secret-jwt-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AI APIs
GEMINI_API_KEY=your-gemini-api-key-here
```

## 🏗️ Project Structure

```
hackforge-hackathon-/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Application entry point & CORS config
│   │   ├── database.py     # Database connection & config
│   │   ├── models.py       # SQLAlchemy database models
│   │   ├── schemas.py      # Pydantic request/response schemas
│   │   ├── auth.py         # JWT & password hashing utilities
│   │   └── routers/        # API route handlers
│   │       ├── auth.py     # Authentication endpoints
│   │       └── users.py    # User management endpoints
│   ├── venv/               # Python virtual environment
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   └── ui/        # shadcn/ui components
│   │   ├── pages/         # Main application pages
│   │   │   ├── Login.tsx  # Login page
│   │   │   ├── Register.tsx # Registration page
│   │   │   └── Dashboard.tsx # Protected dashboard
│   │   ├── services/      # API communication layer
│   │   │   └── api.ts     # Axios setup & API calls
│   │   └── App.tsx        # Main app component & routing
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.js # Tailwind CSS config
├── setup.sh               # Automated setup script
└── README.md             # This file
```

## 🛡️ Authentication Flow

1. **User Registration**: `POST /api/auth/register`
   - Creates new user with hashed password
   - Returns user data (no auto-login)

2. **User Login**: `POST /api/auth/login`
   - Validates credentials
   - Returns JWT access token
   - Frontend stores token in localStorage

3. **Protected Routes**: 
   - Frontend checks for valid token
   - Backend validates JWT on protected endpoints
   - Auto-redirect to login if unauthorized

## 🧪 Testing the API

### Using Swagger UI (Recommended)
1. Go to `http://127.0.0.1:8000/docs`
2. Try the registration endpoint
3. Use login to get a token
4. Click "Authorize" and paste your token
5. Test protected endpoints

### Using curl
```bash
# Register a new user
curl -X POST "http://127.0.0.1:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"testpass123"}'

# Login
curl -X POST "http://127.0.0.1:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

## 🔧 Development Tools

### Backend Development
- **Hot Reload**: Use `--reload` flag with uvicorn
- **Database Migrations**: SQLAlchemy auto-creates tables
- **API Testing**: Swagger UI at `/docs`
- **Debug**: Python debugger support

### Frontend Development
- **Hot Reload**: Automatic with `npm start`
- **TypeScript**: Full type checking
- **ESLint**: Code linting
- **Tailwind**: Utility-first CSS

## 🚀 Deployment Ready

The application is configured for easy deployment:

- **Backend**: FastAPI with production ASGI server
- **Frontend**: Optimized React build
- **Database**: PostgreSQL compatible
- **Environment**: Fully configurable via environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Technologies Used

### Backend
- **FastAPI** - Modern, fast web framework for Python
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Advanced open source database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Pydantic** - Data validation using Python type hints
- **Uvicorn** - ASGI server implementation

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Framer Motion** - Production-ready motion library
- **Axios** - Promise-based HTTP client
- **React Router** - Declarative routing

### Database & AI
- **PostgreSQL** - Primary database
- **Neon DB** - Serverless PostgreSQL
- **Google Gemini API** - AI integration ready

---

## 🆘 Troubleshooting

### Common Issues

1. **CORS Error**: Make sure backend is running on `127.0.0.1:8000` and frontend on `localhost:3000`
2. **Database Connection**: Check your `DATABASE_URL` in `.env` file
3. **Port Conflicts**: Change ports in startup commands if needed
4. **Python Version**: Use Python 3.12 for best compatibility
5. **bcrypt Errors**: The app automatically handles password length limits

### Registration/Login Issues

If you're getting 500 errors during registration:
1. Check that your password is reasonable length (under 72 characters)
2. Ensure the database connection is working
3. Check the backend logs for specific error messages

### Getting Help

- Check the Swagger UI at `http://127.0.0.1:8000/docs` for API issues
- Review browser console for frontend errors
- Check terminal output for backend errors

---

## 📋 Recent Updates

- ✅ Fixed bcrypt compatibility issues with Python 3.12
- ✅ Improved CORS configuration for development
- ✅ Updated API base URL consistency
- ✅ Enhanced password hashing with length validation
- ✅ Added comprehensive API documentation
- ✅ Fixed frontend/backend communication issues

---

**Happy Hacking! 🎯**

A full-stack application with FastAPI backend and React frontend, featuring user authentication and AI integrations.

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Database (via Neon DB)
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Gemini API** - AI integration

### Frontend
- **React** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **React Router** - Navigation

## Project Structure

```
hackforge-hackathon/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth.py              # Authentication utilities
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py          # Authentication routes
│   │       └── users.py         # User routes
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables
│   └── start.sh                 # Startup script
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ui/              # shadcn/ui components
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   └── Dashboard.tsx
    │   ├── services/
    │   │   └── api.ts           # API service
    │   ├── lib/
    │   │   └── utils.ts         # Utility functions
    │   ├── App.tsx              # Main App component
    │   ├── index.tsx            # React entry point
    │   └── index.css            # Global styles
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── tsconfig.json
```

## Features

### Authentication
- [x] User registration with email validation
- [x] JWT-based login system
- [x] Protected routes
- [x] User session management

### UI/UX
- [x] Modern, responsive design with Tailwind CSS
- [x] shadcn/ui components for consistency
- [x] Smooth animations with Framer Motion
- [x] Form validation and error handling

### Database
- [x] PostgreSQL integration via Neon DB
- [x] User schema with proper relationships
- [x] Database migrations ready
- [x] Connection pooling configured

### AI Integration Ready
- [x] Gemini API key configured
- [x] Backend structure ready for AI features
- [x] Placeholder UI for AI-powered features

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. The `.env` file is already configured with your database connection and API keys.

5. Start the FastAPI server:
   ```bash
   # Using the startup script
   chmod +x start.sh
   ./start.sh
   
   # Or manually
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - OAuth2 form login
- `POST /api/auth/login-json` - JSON login

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/profile` - Get user profile (alternative)

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://neondb_owner:npg_H4ZGiac3UzSF@ep-billowing-salad-a18pn53g-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=AIzaSyAQhFq6fZclcC4tse4HDzJp34EtFM1Q3Hg
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend
You can create a `.env` file in the frontend directory for additional configuration:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- CORS configured for development
- SQL injection protection via SQLAlchemy ORM
- Input validation with Pydantic

## Next Steps

1. **Install Dependencies**: Run the setup commands for both backend and frontend
2. **Test Authentication**: Try registering and logging in
3. **Explore Dashboard**: Check out the welcome interface
4. **Add AI Features**: Integrate Gemini API for the planned features:
   - AI-driven tips
   - OCR enhancement
   - Natural language queries

## Development

### Adding New Features
1. Backend: Add routes in `app/routers/`
2. Frontend: Add components in `src/components/` or pages in `src/pages/`
3. Update API service in `src/services/api.ts`

### Database Changes
1. Modify models in `app/models.py`
2. Update schemas in `app/schemas.py`
3. The tables will be created automatically on startup

## Troubleshooting

1. **Database Connection Issues**: Ensure the Neon DB connection string is correct
2. **CORS Errors**: Check that the backend ALLOWED_ORIGINS includes your frontend URL
3. **Authentication Issues**: Verify JWT tokens are being stored and sent correctly
4. **Module Import Errors**: Ensure all dependencies are installed

## Production Deployment

1. **Backend**: 
   - Change SECRET_KEY to a secure random string
   - Update ALLOWED_ORIGINS for your domain
   - Use a production WSGI server like Gunicorn

2. **Frontend**:
   - Build with `npm run build`
   - Serve static files with a web server
   - Update API_URL to your production backend

---

Built with ❤️ for the HackForge Hackathon