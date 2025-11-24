export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'provider' | 'admin';
  avatarUrl?: string;
  profileImage?: string;
  isVerified?: boolean;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_STARTED';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUnit?: 'HOURLY' | 'DAILY' | 'PER_PERSON' | 'FIXED' | 'PER_METRIC';
  location: string;
  latitude: number;
  longitude: number;
  images: string[];
  rating: number;
  reviewCount: number;
  type: 'PRESENTIAL' | 'DIGITAL';
  hostYears: number;
  hostLanguages: string[];
  hostJob: string;
  highlights: string[];
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  userId: string;
  category?: Category;
  provider?: User;
  owner?: User;
  reviews?: Review[];
  isFavorited?: boolean;
  duration?: number;
  bufferTime?: number;
  paymentMethods?: string[];
  availability?: Record<string, { active: boolean; start: string; end: string }>;
}

export type CreateServiceDTO = Omit<
  Service,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'rating'
  | 'reviewCount'
  | 'provider'
  | 'owner'
  | 'category'
  | 'reviews'
  | 'isFavorited'
>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // URL or icon name
  services?: Service[];
}

export interface HomeData {
  categories: Category[];
}

export interface Booking {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  totalPrice: number;
  serviceFee: number;
  providerEarnings: number;
  createdAt: string;
  updatedAt: string;
  service: Service;
}

export interface Appointment {
  id: string;
  serviceName: string;
  date: string;
  duration: number;
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  userId: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface ApiResponse<T> {
  status: string;
  data: T;
}
