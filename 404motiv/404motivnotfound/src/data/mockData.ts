import { Recycler, WasteCategory, EducationLevel, QRProduct, SocialEvent } from '../types';

export const recyclers: Recycler[] = [
  {
    id: '1',
    name: 'EcoRecycle Center',
    address: '123 Green Street, Downtown',
    phone: '+1 (555) 123-4567',
    email: 'contact@ecorecycle.com',
    categories: ['plastic', 'paper', 'glass'],
    rating: 4.8,
    distance: 2.3,
    verified: true
  },
  {
    id: '2',
    name: 'Metal Works Recycling',
    address: '456 Industrial Ave',
    phone: '+1 (555) 987-6543',
    email: 'info@metalworks.com',
    categories: ['metal', 'electronics'],
    rating: 4.5,
    distance: 5.1,
    verified: true
  },
  {
    id: '3',
    name: 'Green Electronics Hub',
    address: '789 Tech Boulevard',
    phone: '+1 (555) 456-7890',
    email: 'hello@greenelectronics.com',
    categories: ['electronics', 'batteries'],
    rating: 4.9,
    distance: 3.7,
    verified: true
  }
];

export const wasteCategories: WasteCategory[] = [
  {
    id: 'plastic',
    name: 'Plastic',
    description: 'Bottles, containers, packaging materials',
    icon: 'Trash2',
    recyclers: recyclers.filter(r => r.categories.includes('plastic'))
  },
  {
    id: 'paper',
    name: 'Paper',
    description: 'Newspapers, magazines, cardboard',
    icon: 'FileText',
    recyclers: recyclers.filter(r => r.categories.includes('paper'))
  },
  {
    id: 'glass',
    name: 'Glass',
    description: 'Bottles, jars, containers',
    icon: 'Wine',
    recyclers: recyclers.filter(r => r.categories.includes('glass'))
  },
  {
    id: 'metal',
    name: 'Metal',
    description: 'Cans, foil, scrap metal',
    icon: 'Zap',
    recyclers: recyclers.filter(r => r.categories.includes('metal'))
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Phones, computers, appliances',
    icon: 'Smartphone',
    recyclers: recyclers.filter(r => r.categories.includes('electronics'))
  }
];

export const educationLevels: EducationLevel[] = [
  {
    id: '1',
    title: 'Recycling Basics',
    description: 'Learn the fundamentals of waste sorting and recycling',
    completed: true,
    points: 100,
    badge: '🌱'
  },
  {
    id: '2',
    title: 'Plastic Classification',
    description: 'Understand different plastic types and their recycling codes',
    completed: true,
    points: 150,
    badge: '♻️'
  },
  {
    id: '3',
    title: 'E-Waste Management',
    description: 'Master electronic waste disposal and recycling methods',
    completed: false,
    points: 200,
    badge: '💡'
  },
  {
    id: '4',
    title: 'Community Champion',
    description: 'Lead local recycling initiatives and educate others',
    completed: false,
    points: 300,
    badge: '🏆'
  }
];

export const qrProducts: QRProduct[] = [
  {
    id: '1',
    name: 'Eco Water Bottle',
    category: 'Plastic',
    manufacturer: 'GreenTech Industries',
    qrCode: 'QR_ECO_BOTTLE_001',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Smart Phone Case',
    category: 'Electronics',
    manufacturer: 'TechGuard Corp',
    qrCode: 'QR_PHONE_CASE_002',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    name: 'Recyclable Food Container',
    category: 'Plastic',
    manufacturer: 'EcoPackaging Ltd',
    qrCode: 'QR_FOOD_CONTAINER_003',
    createdAt: '2024-01-17'
  }
];

export const socialEvents: SocialEvent[] = [
  {
    id: '1',
    title: 'Community Cleanup Drive',
    description: 'Join us for a neighborhood cleanup and recycling awareness event',
    date: '2024-02-10',
    location: 'Central Park',
    participants: 45,
    maxParticipants: 100
  },
  {
    id: '2',
    title: 'E-Waste Collection Day',
    description: 'Bring your old electronics for proper recycling and disposal',
    date: '2024-02-15',
    location: 'Community Center',
    participants: 23,
    maxParticipants: 50
  },
  {
    id: '3',
    title: 'Recycling Workshop',
    description: 'Learn DIY recycling techniques and upcycling ideas',
    date: '2024-02-20',
    location: 'Green Learning Hub',
    participants: 18,
    maxParticipants: 30
  }
];