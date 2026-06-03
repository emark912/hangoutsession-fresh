export type UserRole = "user" | "admin";
export type BookingStatus = "requested" | "confirmed" | "completed" | "cancelled";
export type HangoutStatus = "draft" | "published" | "archived";

export interface User {
  id: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  bio?: string;
  phone?: string;
  locationCity?: string;
  locationState?: string;
  role: UserRole;
  averageRating: number;
  reviewCount: number;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HangoutSession {
  id: string;
  hostId: string;
  title: string;
  description: string;
  category: string;
  locationCity: string;
  locationState: string;
  locationExactAddress: string;
  locationLat?: number;
  locationLng?: number;
  pricePerGuest: number;
  durationHours: number;
  maxGuests: number;
  images?: string[];
  accommodations?: string[];
  requirements?: string;
  averageRating: number;
  reviewCount: number;
  status: HangoutStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  hangoutId: string;
  guestId: string;
  hostId: string;
  status: BookingStatus;
  guestCount: number;
  totalPrice: number;
  platformFee: number;
  hostEarnings: number;
  paymentIntentId?: string;
  scheduledDate: Date;
  scheduledTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  bookingId?: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}
