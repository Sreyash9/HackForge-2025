import { User as DBUser } from '../db/models';
import { User as FrontendUser } from './index';

export const convertDBUserToFrontendUser = (dbUser: DBUser): FrontendUser => {
  return {
    id: dbUser._id?.toString() || '',
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.userType,
    // You can add avatar later if needed
  };
};