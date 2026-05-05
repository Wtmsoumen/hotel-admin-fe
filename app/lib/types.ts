// ─── Discovery & Search ──────────────────────────────────────────────────────

export interface ApiDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  hotelsCount: number;
  emoji?: string;
  trending: boolean;
  avgPricePerNight: number;
  currency: string;
  rating: number;
  bookingsCount: number;
}

export interface ApiHotelCategory {
  id: string;
  name: string;       // "5 Star" | "Sea Hotel" | "City Hotel" | "Resorts"
  icon?: string;
  count: number;
}

export interface ApiLocationResult {
  id: string;
  name: string;
  type: "city" | "property" | "region";
  country?: string;
}

export interface ApiTestimonial {
  id: string;
  guestName: string;
  guestInitials?: string;
  avatar?: string;
  hotelName: string;
  roomType?: string;
  rating: number;
  title?: string;
  comment: string;
  date: string;
  status: "published" | "pending" | "flagged";
  helpfulCount: number;
  bookingId?: string;
}

export interface ApiNewsletterResponse {
  success: boolean;
  message: string;
}

// ─── Hotels Listing ───────────────────────────────────────────────────────────

export interface HotelListParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  minPrice?: string;
  maxPrice?: string;
  /** Numeric star rating: "3" | "4" | "5" */
  rating?: string;
  page?: string;
  limit?: string;
}

export interface ApiHotel {
  id: string;
  name: string;
  location: string;
  category: string;          // "5 Star" | "4 Star" | "3 Star"
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  status: "active" | "inactive" | "maintenance";
  thumbnail?: string;
  roomsCount: number;
}

export interface ApiHotelListResponse {
  results: ApiHotel[];
  total: number;
  page: number;
  limit: number;
}

// ─── Hotel Details & Rooms ────────────────────────────────────────────────────

export interface ApiHotelDetail extends ApiHotel {
  gallery: string[];
  overview: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface ApiRoom {
  id: string;
  name: string;
  hotelId: string;
  type: string;               // "Standard" | "Deluxe" | "Suite" | "Villa" | "Cabin"
  capacity: string;           // "2 Adults, 1 Child"
  bedConfiguration: string;   // "1 King Bed"
  sizeSquareMeters: number;
  pricePerNight: number;
  currency: string;
  status: "available" | "occupied" | "maintenance";
  amenities: string[];
}

export interface ApiAmenity {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface ApiAvailabilityRequest {
  checkIn: string;
  checkOut: string;
  roomType?: string;
}

export interface ApiAvailabilityResponse {
  available: boolean;
  roomId?: string;
  message?: string;
}

export interface ApiNearbyAttraction {
  id: string;
  name: string;
  type: string;
  distance: string;
  lat?: number;
  lng?: number;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export interface ApiBookingInitiateRequest {
  guestName: string;
  guestEmail: string;
  hotelId: string;
  roomId?: string;
  roomType?: string;
  checkIn: string;          // ISO date "2026-04-22"
  checkOut: string;         // ISO date "2026-04-26"
  guests: number;
  totalAmount: number;
  currency: string;
}

export interface ApiBookingInitiateResponse {
  bookingId: string;
  sessionToken: string;
  expiresAt: string;
  status: "pending" | "confirmed";
}

// ─── Auth & User ──────────────────────────────────────────────────────────────

export interface ApiAuthRequest {
  email: string;
  password: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  avatar?: string;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export interface ApiFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order: number;
}
