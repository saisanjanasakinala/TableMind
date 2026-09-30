export type UserRole = 'customer' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  restaurantId?: string; // If owner, which restaurant they manage
}

export type SeatingType = 'indoor' | 'patio' | 'booth' | 'window' | 'bar' | 'private';

export type TableShape = 'round' | 'rectangle' | 'square';

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface RestaurantTable {
  id: string;
  restaurantId: string;
  tableNumber: string;
  capacity: number;
  minCapacity: number;
  seatingType: SeatingType;
  shape: TableShape;
  posX: number; // percentage 0-100 for floor plan
  posY: number; // percentage 0-100 for floor plan
  isActive: boolean; // if false, disabled for maintenance/closure
  currentStatus?: TableStatus;
}

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';

export interface Reservation {
  id: string;
  reservationCode: string;
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  tableNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM (24h)
  durationMinutes: number; // default 90
  guestCount: number;
  seatingPreference?: SeatingType;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
  aiAssisted?: boolean;
  notes?: string;
}

export interface MenuItem {
  name: string;
  description: string;
  price: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Drinks' | 'Chef Tasting';
  isChefSpecial?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cuisine: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  reviewCount: number;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  email: string;
  openingHours: {
    open: string;
    close: string;
    days: string;
  };
  heroImage: string;
  galleryImages: string[];
  menuHighlights: MenuItem[];
  ownerId: string;
  featured?: boolean;
}

export interface SmartAllocationResult {
  recommendedTable: RestaurantTable;
  score: number;
  reason: string;
  capacityMatch: 'exact' | 'good' | 'upgrade';
  efficiencyRate: number; // e.g. 100% if 4 guests on 4-top
  alternativeTables: RestaurantTable[];
}

export interface WaitTimePrediction {
  estimatedWaitMinutes: number;
  reasoning: string;
  tablesFreeingSoon: {
    tableNumber: string;
    freedAt: string;
    capacity: number;
  }[];
  alternativeTimes: string[];
}

export interface AIAssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  actionableReservation?: {
    restaurantId: string;
    restaurantName: string;
    tableId: string;
    tableNumber: string;
    date: string;
    time: string;
    guestCount: number;
    seatingType: SeatingType;
    isAvailable: boolean;
    reasoning?: string;
  };
  alternativeSuggestions?: {
    time: string;
    tableNumber: string;
    capacity: number;
    seatingType: string;
  }[];
  estimatedWaitMinutes?: number;
}
