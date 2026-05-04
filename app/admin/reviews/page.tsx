const reviews = [
  { id: "RV-0841", guest: "Sarah Johnson", avatar: "SJ", hotel: "Somerset Downtown", room: "Deluxe Suite", rating: 5, title: "Absolutely stunning property!", comment: "The staff went above and beyond to make our stay memorable. The room was impeccably clean, the view was breathtaking, and the amenities were top-notch. Will definitely be returning!", date: "Apr 19, 2026", status: "Published", helpful: 24, booking: "BK-1041" },
  { id: "RV-0840", guest: "Michael Chen", avatar: "MC", hotel: "Comfortable Villa Green", room: "Mansion Room", rating: 4, title: "Beautiful villa with incredible views", comment: "Loved the location and the design. The villa felt luxurious and private. Minor issue with the pool heating but staff resolved it quickly.", date: "Apr 18, 2026", status: "Published", helpful: 18, booking: "BK-1040" },
  { id: "RV-0839", guest: "Emma Wilson", avatar: "EW", hotel: "4 Star Hotel", room: "Superior Room", rating: 5, title: "Perfect stay, everything as described", comment: "Exceeded all expectations. The hotel is exactly as shown in photos, maybe even better. Restaurant food was excellent too.", date: "Apr 17, 2026", status: "Published", helpful: 31, booking: "BK-1039" },
  { id: "RV-0838", guest: "Raj Patel", avatar: "RP", hotel: "5 Star Hotel", room: "Rescue Room", rating: 3, title: "Good but room service was slow", comment: "The hotel itself is beautiful but waited 45 minutes for room service. Location is great. Would give 5 stars if service improved.", date: "Apr 16, 2026", status: "Flagged", helpful: 5, booking: "BK-1038" },
  { id: "RV-0837", guest: "Lucas Smith", avatar: "LS", hotel: "3 Star Hotel", room: "Mansion Room", rating: 4, title: "Great value for money", comment: "For the price, you cannot beat this hotel. Clean rooms, friendly staff, close to all the major attractions. Will book again.", date: "Apr 15, 2026", status: "Published", helpful: 12, booking: "BK-1036" },
  { id: "RV-0836", guest: "Priya Sharma", avatar: "PS", hotel: "Royal Heritage Hotel", room: "Royal Suite", rating: 5, title: "The pinnacle of luxury hospitality", comment: "From the moment we checked in, we were treated like royalty. The butler service, the spa, the fine dining — everything was world-class. Truly unforgettable.", date: "Apr 14, 2026", status: "Published", helpful: 56, booking: "BK-1035" },
  { id: "RV-0835", guest: "Amelia Brown", avatar: "AB", hotel: "Somerset Downtown", room: "Standard Room", rating: 2, title: "Disappointing experience", comment: "The photos on the website do not match reality. The room was smaller than expected and there was a noise issue from the floor above.", date: "Apr 13, 2026", status: "Pending", helpful: 2, booking: "BK-1037" },
];

const statusStyles: Record<string, string> = {
  Published: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  Flagged: "bg-red-500/15 text-red-400 border border-red-500/20",
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const sizeClass = size === "xs" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${sizeClass} ${i < rating ? "text-gold" : "text-dark-border"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const ratingDist = [
  { stars: 5, count: 621, pct: 72 },
  { stars: 4, count: 168, pct: 19 },
  { stars: 3, count: 52, pct: 6 },
  { stars: 2, count: 18, pct: 2 },
  { stars: 1, count: 8, pct: 1 },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-white">4.6</p>
              <StarRating rating={5} />
              <p className="text-dark-muted text-xs mt-1">867 reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDist.map((d) => (
                <div key={d.stars} className="flex items-center gap-2">
                  <span className="text-dark-muted text-xs w-4">{d.stars}</span>
                  <div className="flex-1 h-1.5 bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${d.pct}%` }} />
                  </div>
                  <span className="text-dark-muted text-xs w-8">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 lg:col-span-2">
          {[
            { label: "Total Reviews", value: "867", icon: "⭐" },
            { label: "Published", value: "821", icon: "✅" },
            { label: "Pending", value: "32", icon: "⏳" },
            { label: "Flagged", value: "14", icon: "🚩" },
            { label: "Avg Rating", value: "4.6", icon: "📊" },
            { label: "This Month", value: "124", icon: "📅" },
          ].map((s) => (
            <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-3 text-center">
              <span className="text-xl">{s.icon}</span>
              <p className="text-white font-bold text-base mt-1">{s.value}</p>
              <p className="text-dark-muted text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["All", "Published", "Pending", "Flagged"].map((f) => (
            <button
              key={f}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                f === "All"
                  ? "bg-gold text-dark"
                  : "bg-dark-card border border-dark-border text-dark-muted hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <select className="bg-dark-card border border-dark-border text-dark-muted text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold">
            <option>All Ratings</option>
            <option>5 Stars</option>
            <option>4 Stars</option>
            <option>3 Stars & Below</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/20 transition-colors">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/20 flex items-center justify-center shrink-0">
                <span className="text-gold text-sm font-bold">{r.avatar}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{r.guest}</p>
                      <StarRating rating={r.rating} size="xs" />
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-dark-muted text-xs mt-0.5">
                      {r.hotel} • {r.room} • {r.date}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {r.status === "Pending" && (
                      <button className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium rounded-lg hover:bg-emerald-500/20 transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve
                      </button>
                    )}
                    {r.status === "Flagged" && (
                      <button className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium rounded-lg hover:bg-red-500/20 transition-colors">
                        Remove
                      </button>
                    )}
                    <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <h4 className="text-white text-sm font-medium mt-2">{r.title}</h4>
                <p className="text-dark-muted text-xs mt-1 leading-relaxed">{r.comment}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border/50">
                  <div className="flex items-center gap-1.5 text-dark-muted text-xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    {r.helpful} found helpful
                  </div>
                  <span className="text-dark-muted text-[10px] font-mono">{r.id} • {r.booking}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
