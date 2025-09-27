import { ObjectId } from 'mongodb';

export type UserType = 'local' | 'manufacturer' | 'recycler';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  userType: UserType;
  name: string;
  createdAt: Date;
  // Common fields for all user types
  address?: string;
  phone?: string;

  // Specific fields based on user type
  // Local user specific fields
  preferences?: {
    notificationsEnabled?: boolean;
    gamificationEnabled?: boolean;
  };

  // Manufacturer specific fields
  companyName?: string;
  productCategories?: string[];

  // Recycler specific fields
  serviceAreas?: string[];
  acceptedMaterials?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserType;
}