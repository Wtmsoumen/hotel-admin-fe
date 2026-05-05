import type {
  ApiDestination,
  ApiHotelCategory,
  ApiLocationResult,
  ApiTestimonial,
  ApiNewsletterResponse,
  HotelListParams,
  ApiHotel,
  ApiHotelListResponse,
  ApiHotelDetail,
  ApiRoom,
  ApiAmenity,
  ApiAvailabilityRequest,
  ApiAvailabilityResponse,
  ApiNearbyAttraction,
  ApiBookingInitiateRequest,
  ApiBookingInitiateResponse,
  ApiAuthRequest,
  ApiAuthResponse,
  ApiUser,
  ApiFaq,
} from "./types";

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "") || "/api/v1";

// ─── Core fetch helper ────────────────────────────────────────────────────────

function authHeader(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = buildUrl(path, params);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...authHeader() },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}${BASE}${path}`
      : `http://localhost:3000${BASE}${path}`;
  const url = new URL(base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

// ─── 1. Discovery & Search ────────────────────────────────────────────────────

/** GET /api/v1/destinations/trending */
export async function fetchTrendingDestinations(): Promise<ApiDestination[]> {
  return get<ApiDestination[]>("/destinations/trending");
}

/** GET /api/v1/hotels/categories */
export async function fetchHotelCategories(): Promise<ApiHotelCategory[]> {
  return get<ApiHotelCategory[]>("/hotels/categories");
}

/** GET /api/v1/locations/search?query={term} */
export async function searchLocations(query: string): Promise<ApiLocationResult[]> {
  return get<ApiLocationResult[]>("/locations/search", { query });
}

/** GET /api/v1/testimonials */
export async function fetchTestimonials(): Promise<ApiTestimonial[]> {
  return get<ApiTestimonial[]>("/testimonials");
}

/** POST /api/v1/newsletter/subscribe */
export async function subscribeNewsletter(email: string): Promise<ApiNewsletterResponse> {
  return post<ApiNewsletterResponse>("/newsletter/subscribe", { email });
}

// ─── 2. Listings & Filters ────────────────────────────────────────────────────

/**
 * GET /api/v1/hotels
 * Params: location, checkIn, checkOut, guests, minPrice, maxPrice, rating
 */
export async function fetchHotels(params: HotelListParams): Promise<ApiHotelListResponse> {
  return get<ApiHotelListResponse>("/hotels", params as Record<string, string>);
}

/** GET /api/v1/hotels/featured */
export async function fetchFeaturedHotels(): Promise<ApiHotel[]> {
  return get<ApiHotel[]>("/hotels/featured");
}

/** GET /api/v1/hotels/popular */
export async function fetchPopularHotels(): Promise<ApiHotel[]> {
  return get<ApiHotel[]>("/hotels/popular");
}

/** GET /api/v1/faqs */
export async function fetchFaqs(): Promise<ApiFaq[]> {
  return get<ApiFaq[]>("/faqs");
}

// ─── 3. Hotel Details & Booking ───────────────────────────────────────────────

/** GET /api/v1/hotels/{hotel_id} */
export async function fetchHotelById(hotelId: string): Promise<ApiHotelDetail> {
  return get<ApiHotelDetail>(`/hotels/${hotelId}`);
}

/** GET /api/v1/hotels/{hotel_id}/rooms */
export async function fetchHotelRooms(hotelId: string): Promise<ApiRoom[]> {
  return get<ApiRoom[]>(`/hotels/${hotelId}/rooms`);
}

/** GET /api/v1/hotels/{hotel_id}/amenities */
export async function fetchHotelAmenities(hotelId: string): Promise<ApiAmenity[]> {
  return get<ApiAmenity[]>(`/hotels/${hotelId}/amenities`);
}

/** GET /api/v1/hotels/{hotel_id}/availability  (body params sent as query) */
export async function checkAvailability(
  hotelId: string,
  req: ApiAvailabilityRequest
): Promise<ApiAvailabilityResponse> {
  return get<ApiAvailabilityResponse>(`/hotels/${hotelId}/availability`, req as unknown as Record<string, string>);
}

/** GET /api/v1/hotels/{hotel_id}/nearby-attractions */
export async function fetchNearbyAttractions(hotelId: string): Promise<ApiNearbyAttraction[]> {
  return get<ApiNearbyAttraction[]>(`/hotels/${hotelId}/nearby-attractions`);
}

// ─── 4. Transactional & User ──────────────────────────────────────────────────

/** POST /api/v1/bookings/initiate */
export async function initiateBooking(
  data: ApiBookingInitiateRequest
): Promise<ApiBookingInitiateResponse> {
  return post<ApiBookingInitiateResponse>("/bookings/initiate", data);
}

/** POST /api/v1/auth/login */
export async function login(credentials: ApiAuthRequest): Promise<ApiAuthResponse> {
  const res = await post<ApiAuthResponse>("/auth/login", credentials);
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", res.accessToken);
    localStorage.setItem("auth_user", JSON.stringify(res.user));
  }
  return res;
}

/** POST /api/v1/auth/signup */
export async function signup(data: ApiAuthRequest & { name: string }): Promise<ApiAuthResponse> {
  const res = await post<ApiAuthResponse>("/auth/signup", data);
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", res.accessToken);
    localStorage.setItem("auth_user", JSON.stringify(res.user));
  }
  return res;
}

/** GET /api/v1/user/profile */
export async function fetchUserProfile(): Promise<ApiUser> {
  return get<ApiUser>("/user/profile");
}

/** Clear auth tokens (logout) */
export function clearAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }
}
