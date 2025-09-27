import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { convertDBUserToFrontendUser } from '../types/converters';
import { AuthService } from '../db/auth.service';
import { UserType } from '../db/models';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for saved auth data on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, userType: UserType) => {
    // Create a mock user with the selected role
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: email || 'test@example.com',
      role: userType
    };

    // Set mock token
    const mockToken = 'mock-token-' + Date.now();
    
    setUser(mockUser);
    setToken(mockToken);
    setIsAuthenticated(true);
    
    // Save mock auth data
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (userData: any) => {
    try {
      const result = await AuthService.register(userData);
      const frontendUser = convertDBUserToFrontendUser(result.user);
      
      setUser(frontendUser);
      setToken(result.token);
      setIsAuthenticated(true);
      
      // Save auth data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(frontendUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};