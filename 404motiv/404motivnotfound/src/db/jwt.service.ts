import jwt from 'jsonwebtoken';
import { User } from './models';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (user: User): string => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      userType: user.userType 
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};