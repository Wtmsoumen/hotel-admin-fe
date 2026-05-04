const destinations = [
  { id: "D-01", name: "Paris", country: "France", region: "Europe", hotels: 12, image: "🗼", trending: true, avgPrice: "$380/night", rating: 4.8, bookings: 1240 },
  { id: "D-02", name: "Bali", country: "Indonesia", region: "Asia", hotels: 28, image: "🌴", trending: true, avgPrice: "$150/night", rating: 4.9, bookings: 2180 },
  { id: "D-03", name: "Dubai", country: "UAE", region: "Middle East", hotels: 18, image: "🏙️", trending: true, avgPrice: "$480/night", rating: 4.7, bookings: 980 },
  { id: "D-04", name: "Switzerland", country: "Switzerland", region: "Europe", hotels: 8, image: "🏔️", trending: false, avgPrice: "$520/night", rating: 4.9, bookings: 640 },
  { id: "D-05", name: "Greece", country: "Greece", region: "Europe", hotels: 15, image: "🏛️", trending: true, avgPrice: "$280/night", rating: 4.7, bookings: 870 },
  { id: "D-06", name: "Vietnam", country: "Vietnam", region: "Asia", hotels: 10, image: "🌿", trending: false, avgPrice: "$85/night", rating: 4.5, bookings: 520 },
  { id: "D-07", name: "Singapore", country: "Singapore", region: "Asia", hotels: 22, image: "🦁", trending: true, avgPrice: "$320/night", rating: 4.8, bookings: 1120 },
  { id: "D-08", name: "Thailand", country: "Thailand", region: "Asia", hotels: 34, image: "🐘", trending: true, avgPrice: "$120/night", rating: 4.6, bookings: 1680 },
  { id: "D-09", name: "New Delhi", country: "India", region: "South Asia", hotels: 20, image: "🕌", trending: false, avgPrice: "$95/night", rating: 4.3, bookings: 380 },
  { id: "D-10", name: "Mumbai", country: "India", region: "South Asia", hotels: 16, image: "🌊", trending: false, avgPrice: "$110/night", rating: 4.4, bookings: 420 },
  { id: "D-11", name: "Goa", country: "India", region: "South Asia", hotels: 42, image: "🏖️", trending: true, avgPrice: "$130/night", rating: 4.6, bookings: 890 },
  { id: "D-12", name: "Jaipur", country: "India", region: "South Asia", hotels: 14, image: "🏰", trending: false, avgPrice: "$80/night", rating: 4.4, bookings: 310 },
];

export default function DestinationsPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Destinations", value: "48", sub: "Worldwide" },
          { label: "Trending Now", value: "7", sub: "High demand" },
          { label: "Total Hotels", value: "239", sub: "Across all cities" },
          { label: "Total Bookings", value: "11,230", sub: "This quarter" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
            <p className="text-dark-muted/60 text-[10px] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["All", "Asia", "Europe", "Middle East", "South Asia"].map((r) => (
            <button
              key={r}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                r === "All"
                  ? "bg-gold text-dark"
                  : "bg-dark-card border border-dark-border text-dark-muted hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-dark text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Destination
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {destinations.map((d) => (
          <div key={d.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-gold/30 transition-all group">
            {/* Image area */}
            <div className="h-28 bg-gradient-to-br from-dark to-dark-hover flex items-center justify-center relative">
              <span className="text-5xl">{d.image}</span>
              {d.trending && (
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gold text-dark px-2 py-0.5 rounded-full">
                  Trending
                </span>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="p-1.5 rounded-md bg-dark/80 border border-dark-border text-dark-muted hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-1.5 rounded-md bg-dark/80 border border-dark-border text-dark-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold text-sm">{d.name}</h3>
                  <p className="text-dark-muted text-xs">{d.country}</p>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white text-xs font-medium">{d.rating}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dark-border">
                <div>
                  <p className="text-dark-muted text-[10px]">Hotels</p>
                  <p className="text-white text-xs font-medium">{d.hotels}</p>
                </div>
                <div>
                  <p className="text-dark-muted text-[10px]">Bookings</p>
                  <p className="text-white text-xs font-medium">{d.bookings.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-dark-muted text-[10px]">Avg. Price</p>
                  <p className="text-gold text-xs font-semibold">{d.avgPrice}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
