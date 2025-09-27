from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from beanie import PydanticObjectId
from app.models import User
from app.schemas import UserCreate, UserResponse, Token, LoginRequest
from app.auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_user_by_username(username: str):
    return await User.find_one(User.username == username)

async def get_user_by_email(email: str):
    return await User.find_one(User.email == email)

async def create_user(user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password
    )
    await db_user.create()
    return db_user

async def authenticate_user(username: str, password: str):
    user = await get_user_by_username(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if payload is None:
        raise credentials_exception
    
    username: str = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = await get_user_by_username(username)
    if user is None:
        raise credentials_exception
    
    return user

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user_by_email = await get_user_by_email(user.email)
    if existing_user_by_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    existing_user_by_username = await get_user_by_username(user.username)
    if existing_user_by_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    # Create new user
    db_user = await create_user(user)
    return UserResponse(
        id=str(db_user.id),
        email=db_user.email,
        username=db_user.username,
        is_active=db_user.is_active,
        sanctioned_load_kw=db_user.sanctioned_load_kw,
        address=db_user.address,
        consumer_number=db_user.consumer_number,
        created_at=db_user.created_at
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login-json", response_model=Token)
async def login_json(login_data: LoginRequest):
    user = await authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        is_active=current_user.is_active,
        sanctioned_load_kw=current_user.sanctioned_load_kw,
        address=current_user.address,
        consumer_number=current_user.consumer_number,
        previous_month_bill=current_user.previous_month_bill,
        created_at=current_user.created_at
    )

@router.put("/update-previous-bill")
async def update_previous_month_bill(
    bill_amount: float,
    current_user: User = Depends(get_current_user)
):
    if bill_amount < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bill amount cannot be negative"
        )
    
    current_user.previous_month_bill = bill_amount
    current_user.updated_at = datetime.utcnow()
    await current_user.save()
    
    return {"message": "Previous month bill updated successfully", "amount": bill_amount}