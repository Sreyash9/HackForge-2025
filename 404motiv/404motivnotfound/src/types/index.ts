export interface User {
  id: string;
  name: string;
  email: string;
  role: 'local' | 'manufacturer' | 'recycler';
  avatar?: string;
}

export interface Recycler {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  categories: string[];
  rating: number;
  distance: number;
  verified: boolean;
}

export interface WasteCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  recyclers: Recycler[];
}

export interface EducationLevel {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  badge?: string;
}

export interface QRProduct {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  qrCode: string;
  createdAt: string;
}

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: string;
}