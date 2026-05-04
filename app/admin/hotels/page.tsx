const hotels = [
  { id: "H-001", name: "Somerset Downtown", location: "New York, USA", category: "5 Star", rooms: 48, rating: 4.8, reviews: 312, status: "Active", price: "$350/night", image: "SD" },
  { id: "H-002", name: "Comfortable Villa Green", location: "Bali, Indonesia", category: "4 Star", rooms: 32, rating: 4.6, reviews: 248, status: "Active", price: "$180/night", image: "CV" },
  { id: "H-003", name: "Grand Palace Hotel", location: "Paris, France", category: "5 Star", rooms: 120, rating: 4.9, reviews: 541, status: "Active", price: "$480/night", image: "GP" },
  { id: "H-004", name: "Mountain View Resort", location: "Switzerland", category: "4 Star", rooms: 64, rating: 4.5, reviews: 187, status: "Active", price: "$290/night", image: "MV" },
  { id: "H-005", name: "Sunset Beach Villa", location: "Thailand", category: "3 Star", rooms: 28, rating: 4.2, reviews: 134, status: "Active", price: "$120/night", image: "SB" },
  { id: "H-006", name: "City Center Inn", location: "Singapore", category: "3 Star", rooms: 56, rating: 4.1, reviews: 201, status: "Inactive", price: "$150/night", image: "CC" },
  { id: "H-007", name: "Royal Heritage Hotel", location: "Dubai, UAE", category: "5 Star", rooms: 200, rating: 4.9, reviews: 672, status: "Active", price: "$650/night", image: "RH" },
  { id: "H-008", name: "Forest Retreat Lodge", location: "Vietnam", category: "3 Star", rooms: 20, rating: 4.3, reviews: 98, status: "Maintenance", price: "$95/night", image: "FR" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Inactive: "bg-red-500/15 text-red-400 border border-red-500/20",
  Maintenance: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

const categories = ["All", "5 Star", "4 Star", "3 Star"];

export default function HotelsPage() {
  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                c === "All"
                  ? "bg-gold text-dark"
                  : "bg-dark-card border border-dark-border text-dark-muted hover:text-white hover:border-gold/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search hotels..."
              className="pl-9 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white placeholder-dark-muted focus:outline-none focus:border-gold transition-colors w-48"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-dark text-sm font-semibold rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Hotel
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Hotels", value: "48", icon: "🏨" },
          { label: "Active Hotels", value: "44", icon: "✅" },
          { label: "Avg Rating", value: "4.6", icon: "⭐" },
          { label: "Total Rooms", value: "568", icon: "🛏️" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{s.value}</p>
              <p className="text-dark-muted text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
          <h2 className="text-white font-semibold">All Hotels</h2>
          <span className="text-dark-muted text-xs">{hotels.length} hotels</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {["Hotel", "Location", "Category", "Rooms", "Rating", "Price/Night", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-dark-muted text-xs font-medium px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel, i) => (
                <tr
                  key={hotel.id}
                  className={`border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors ${i === hotels.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold text-xs font-bold">{hotel.image}</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">{hotel.name}</p>
                        <p className="text-dark-muted text-[10px]">{hotel.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{hotel.location}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full">{hotel.category}</span>
                  </td>
                  <td className="px-5 py-4 text-white text-xs">{hotel.rooms}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white text-xs">{hotel.rating}</span>
                      <span className="text-dark-muted text-[10px]">({hotel.reviews})</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-white text-xs font-semibold">{hotel.price}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[hotel.status]}`}>
                      {hotel.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-gold hover:border-gold/40 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 hover:border-blue-400/40 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 hover:border-red-400/40 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-dark-muted text-xs">Showing 1–8 of 48</span>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 6].map((p, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                  p === 1 ? "bg-gold text-dark" : "bg-dark border border-dark-border text-dark-muted hover:text-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
