"use client";

import { useEffect, useState } from "react";
import * as api from "@/app/lib/api";
import type { ApiHotel, ApiTestimonial } from "@/app/lib/types";

// ─── Static mock fallbacks ────────────────────────────────────────────────────

const MOCK_TOP_HOTELS = [
  { name: "Somerset Downtown", bookings: 312, revenue: "$28,400", occupancy: 92 },
  { name: "Comfortable Villa Green", bookings: 248, revenue: "$22,100", occupancy: 85 },
  { name: "5 Star Hotel", bookings: 195, revenue: "$31,200", occupancy: 78 },
  { name: "4 Star Hotel", bookings: 167, revenue: "$12,800", occupancy: 71 },
];

const MOCK_REVIEWS = [
  { guest: "Sarah J.", hotel: "Somerset Downtown", rating: 5, comment: "Absolutely stunning property. The staff went above and beyond.", date: "Apr 20, 2026" },
  { guest: "Michael C.", hotel: "Comfortable Villa Green", rating: 4, comment: "Beautiful villa with incredible views. Will definitely return.", date: "Apr 19, 2026" },
  { guest: "Emma W.", hotel: "4 Star Hotel", rating: 5, comment: "Perfect stay! Everything was exactly as described.", date: "Apr 18, 2026" },
];

const MOCK_BOOKINGS = [
  { id: "BK-1041", guest: "Sarah Johnson", hotel: "Somerset Downtown", checkIn: "Apr 22, 2026", amount: "$1,240", status: "Confirmed" },
  { id: "BK-1040", guest: "Michael Chen", hotel: "Comfortable Villa Green", checkIn: "Apr 21, 2026", amount: "$890", status: "Checked In" },
  { id: "BK-1039", guest: "Emma Wilson", hotel: "4 Star Hotel", checkIn: "Apr 20, 2026", amount: "$520", status: "Confirmed" },
  { id: "BK-1038", guest: "Raj Patel", hotel: "5 Star Hotel", checkIn: "Apr 19, 2026", amount: "$2,100", status: "Checked Out" },
  { id: "BK-1037", guest: "Amelia Brown", hotel: "Somerset Downtown", checkIn: "Apr 18, 2026", amount: "$620", status: "Cancelled" },
  { id: "BK-1036", guest: "Lucas Smith", hotel: "3 Star Hotel", checkIn: "Apr 17, 2026", amount: "$340", status: "Checked Out" },
];

const STATS = [
  {
    label: "Total Hotels", value: "48", change: "+4 this month", positive: true,
    color: "bg-blue-500/10 text-blue-400",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
  {
    label: "Active Bookings", value: "1,284", change: "+12% vs last month", positive: true,
    color: "bg-[#D8A95B]/10 text-gold",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  {
    label: "Total Revenue", value: "$94,280", change: "+8.2% vs last month", positive: true,
    color: "bg-emerald-500/10 text-emerald-400",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: "Registered Users", value: "5,621", change: "+230 new users", positive: true,
    color: "bg-purple-500/10 text-purple-400",
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
];

const MONTHLY_REVENUE = [
  { month: "Nov", value: 62 }, { month: "Dec", value: 78 }, { month: "Jan", value: 55 },
  { month: "Feb", value: 68 }, { month: "Mar", value: 84 }, { month: "Apr", value: 94 },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  "Checked In": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  "Checked Out": "bg-dark-muted/20 text-dark-muted border border-dark-border",
  Cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
};

// ─── Local types ──────────────────────────────────────────────────────────────

interface TopHotel { name: string; bookings: number; revenue: string; occupancy: number; }
interface Review { guest: string; hotel: string; rating: number; comment: string; date: string; }

function mapApiHotelToTop(h: ApiHotel, idx: number): TopHotel {
  return {
    name: h.name,
    bookings: h.reviewsCount ?? 0,
    revenue: `$${(h.pricePerNight * 30).toLocaleString()}`,
    occupancy: Math.max(60, 95 - idx * 7),
  };
}

function mapApiTestimonialToReview(t: ApiTestimonial): Review {
  return {
    guest: t.guestName || "Guest",
    hotel: t.hotelName || "",
    rating: t.rating ?? 5,
    comment: t.comment || "",
    date: t.date || "",
  };
}

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function BarSkeleton() {
  return <div className="animate-pulse bg-dark-border/40 rounded-t-md w-full" style={{ height: "60%" }} />;
}

function HotelRowSkeleton() {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <div className="animate-pulse bg-dark-border/40 rounded h-3 w-32" />
        <div className="animate-pulse bg-dark-border/40 rounded h-3 w-8" />
      </div>
      <div className="h-1.5 bg-dark rounded-full overflow-hidden">
        <div className="animate-pulse bg-dark-border/40 h-full w-3/4 rounded-full" />
      </div>
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="px-5 py-4 space-y-2">
      <div className="flex gap-2">
        <div className="animate-pulse bg-dark-border/40 rounded-full w-7 h-7 shrink-0" />
        <div className="space-y-1 flex-1">
          <div className="animate-pulse bg-dark-border/40 rounded h-3 w-24" />
          <div className="animate-pulse bg-dark-border/40 rounded h-2.5 w-32" />
        </div>
      </div>
      <div className="animate-pulse bg-dark-border/40 rounded h-3 w-full" />
      <div className="animate-pulse bg-dark-border/40 rounded h-3 w-2/3" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [topHotels, setTopHotels] = useState<TopHotel[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [hotelsSource, setHotelsSource] = useState<"live" | "offline">("offline");
  const [reviewsSource, setReviewsSource] = useState<"live" | "offline">("offline");

  useEffect(() => {
    let cancelled = false;
    api.fetchPopularHotels()
      .then((data) => {
        if (cancelled) return;
        setTopHotels(data.slice(0, 4).map(mapApiHotelToTop));
        setHotelsSource("live");
      })
      .catch(() => {
        if (cancelled) return;
        setTopHotels(MOCK_TOP_HOTELS);
        setHotelsSource("offline");
      })
      .finally(() => { if (!cancelled) setHotelsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.fetchTestimonials()
      .then((data) => {
        if (cancelled) return;
        setReviews(data.slice(0, 3).map(mapApiTestimonialToReview));
        setReviewsSource("live");
      })
      .catch(() => {
        if (cancelled) return;
        setReviews(MOCK_REVIEWS);
        setReviewsSource("offline");
      })
      .finally(() => { if (!cancelled) setReviewsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-dark-border/80 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">↑</span>
            </div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-dark-muted text-sm">{stat.label}</p>
            <p className="text-xs text-emerald-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground font-semibold">Revenue Overview</h2>
              <p className="text-dark-muted text-xs mt-0.5">Last 6 months</p>
            </div>
            <span className="text-gold text-sm font-semibold">$94,280</span>
          </div>
          <div className="flex items-end gap-3 h-36">
            {MONTHLY_REVENUE.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t-md bg-[#D8A95B]/20 hover:bg-[#D8A95B]/40 transition-colors relative group cursor-pointer"
                  style={{ height: `${m.value}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-dark-card border border-dark-border text-foreground text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${m.value}K
                  </div>
                  <div className="absolute bottom-0 w-full rounded-t-md bg-[#D8A95B]" style={{ height: "60%" }} />
                </div>
                <span className="text-dark-muted text-[10px]">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Hotels */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground font-semibold">Top Hotels</h2>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${hotelsSource === "live"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : "text-dark-muted bg-dark border-dark-border"
              }`}>
              {hotelsSource === "live" ? "Live · /hotels/popular" : "Offline mode"}
            </span>
          </div>
          <div className="space-y-4">
            {hotelsLoading
              ? Array.from({ length: 4 }).map((_, i) => <HotelRowSkeleton key={i} />)
              : topHotels.map((hotel, i) => (
                <div key={hotel.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-foreground text-xs font-medium truncate max-w-[130px]">{hotel.name}</span>
                    <span className="text-dark-muted text-xs shrink-0">{hotel.occupancy}%</span>
                  </div>
                  <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#D8A95B] transition-all"
                      style={{ width: `${hotel.occupancy}%`, opacity: 1 - i * 0.15 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-dark-muted text-[10px]">{hotel.bookings} reviews</span>
                    <span className="text-gold text-[10px] font-medium">{hotel.revenue}/mo est.</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
            <h2 className="text-foreground font-semibold">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-gold text-xs font-medium hover:text-gold-light transition-colors">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left text-dark-muted text-xs font-medium px-5 py-3">Booking ID</th>
                  <th className="text-left text-dark-muted text-xs font-medium px-5 py-3">Guest</th>
                  <th className="text-left text-dark-muted text-xs font-medium px-5 py-3 hidden md:table-cell">Hotel</th>
                  <th className="text-left text-dark-muted text-xs font-medium px-5 py-3 hidden lg:table-cell">Check-in</th>
                  <th className="text-left text-dark-muted text-xs font-medium px-5 py-3">Amount</th>
                  <th className="text-left text-dark-muted text-xs font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BOOKINGS.map((b, i) => (
                  <tr key={b.id} className={`border-b border-dark-border/50 hover:bg-white/[0.02] transition-colors ${i === MOCK_BOOKINGS.length - 1 ? "border-0" : ""}`}>
                    <td className="px-5 py-3.5 text-gold text-xs font-mono">{b.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#D8A95B]/20 flex items-center justify-center shrink-0">
                          <span className="text-gold text-[9px] font-bold">{b.guest.split(" ").map((n) => n[0]).join("")}</span>
                        </div>
                        <span className="text-foreground text-xs">{b.guest}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-dark-muted text-xs hidden md:table-cell">{b.hotel}</td>
                    <td className="px-5 py-3.5 text-dark-muted text-xs hidden lg:table-cell">{b.checkIn}</td>
                    <td className="px-5 py-3.5 text-foreground text-xs font-semibold">{b.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
            <h2 className="text-foreground font-semibold">Recent Reviews</h2>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${reviewsSource === "live"
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-dark-muted bg-dark border-dark-border"
                }`}>
                {reviewsSource === "live" ? "Live · /testimonials" : "Offline mode"}
              </span>
              <a href="/admin/reviews" className="text-gold text-xs font-medium hover:text-gold-light transition-colors">
                View all →
              </a>
            </div>
          </div>
          <div className="divide-y divide-dark-border/50">
            {reviewsLoading
              ? Array.from({ length: 3 }).map((_, i) => <ReviewSkeleton key={i} />)
              : reviews.map((r) => (
                <div key={r.guest + r.hotel} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#D8A95B]/20 flex items-center justify-center shrink-0">
                        <span className="text-gold text-[9px] font-bold">{r.guest.replace(".", "")[0]}</span>
                      </div>
                      <div>
                        <p className="text-foreground text-xs font-medium">{r.guest}</p>
                        <p className="text-dark-muted text-[10px]">{r.hotel}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < r.rating ? "text-gold" : "text-dark-border"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-dark-muted text-xs leading-relaxed line-clamp-2">{r.comment}</p>
                  <p className="text-dark-muted/60 text-[10px] mt-2">{r.date}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
