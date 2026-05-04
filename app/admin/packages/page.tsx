const packages = [
  { id: "PKG-01", name: "Bali Escape", destination: "Bali, Indonesia", duration: "7 Nights", hotels: "Comfortable Villa Green", price: "$1,200", originalPrice: "$1,800", includes: ["Flights", "Hotel", "Breakfast", "Tours"], sold: 148, capacity: 200, status: "Active", badge: "Best Seller", image: "🌴" },
  { id: "PKG-02", name: "Paris Romance", destination: "Paris, France", duration: "5 Nights", hotels: "Grand Palace Hotel", price: "$2,400", originalPrice: "$3,200", includes: ["Flights", "Hotel", "Breakfast", "City Tour"], sold: 86, capacity: 150, status: "Active", badge: "Popular", image: "🗼" },
  { id: "PKG-03", name: "Dubai Luxury", destination: "Dubai, UAE", duration: "6 Nights", hotels: "Royal Heritage Hotel", price: "$3,800", originalPrice: "$5,000", includes: ["Flights", "Hotel", "All Meals", "Desert Safari"], sold: 42, capacity: 100, status: "Active", badge: "Premium", image: "🏙️" },
  { id: "PKG-04", name: "Thailand Adventure", destination: "Bangkok & Phuket", duration: "10 Nights", hotels: "Sunset Beach Villa", price: "$1,500", originalPrice: "$2,200", includes: ["Flights", "Hotel", "Breakfast", "Day Trips"], sold: 220, capacity: 300, status: "Active", badge: "Best Value", image: "🐘" },
  { id: "PKG-05", name: "Swiss Alps Getaway", destination: "Switzerland", duration: "8 Nights", hotels: "Mountain View Resort", price: "$4,200", originalPrice: "$5,500", includes: ["Flights", "Hotel", "All Meals", "Ski Pass"], sold: 31, capacity: 80, status: "Active", badge: "", image: "🏔️" },
  { id: "PKG-06", name: "India Discovery", destination: "Delhi, Agra, Jaipur", duration: "7 Nights", hotels: "Multiple Hotels", price: "$950", originalPrice: "$1,400", includes: ["Flights", "Hotel", "Breakfast", "Guide"], sold: 94, capacity: 200, status: "Active", badge: "New", image: "🕌" },
  { id: "PKG-07", name: "Greek Islands Cruise", destination: "Athens & Santorini", duration: "9 Nights", hotels: "Boutique Hotels", price: "$2,800", originalPrice: "$3,600", includes: ["Flights", "Hotel", "Breakfast", "Ferry"], sold: 58, capacity: 120, status: "Active", badge: "", image: "🏛️" },
  { id: "PKG-08", name: "Singapore Experience", destination: "Singapore", duration: "4 Nights", hotels: "City Center Inn", price: "$1,100", originalPrice: "$1,600", includes: ["Flights", "Hotel", "Breakfast"], sold: 172, capacity: 250, status: "Inactive", badge: "", image: "🦁" },
];

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-gold/10 text-gold border-gold/20",
  Popular: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Premium: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Best Value": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  New: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function PackagesPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Packages", value: "24", sub: "Across all destinations" },
          { label: "Total Sold", value: "851", sub: "This quarter" },
          { label: "Revenue", value: "$2.4M", sub: "From packages" },
          { label: "Avg. Discount", value: "28%", sub: "Off regular price" },
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
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search packages..."
            className="pl-9 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white placeholder-dark-muted focus:outline-none focus:border-gold w-52"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-dark text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Package
        </button>
      </div>

      {/* Packages grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {packages.map((pkg) => {
          const soldPct = Math.round((pkg.sold / pkg.capacity) * 100);
          const savings = Math.round(((parseInt(pkg.originalPrice.replace(/[$,]/g, "")) - parseInt(pkg.price.replace(/[$,]/g, ""))) / parseInt(pkg.originalPrice.replace(/[$,]/g, ""))) * 100);

          return (
            <div key={pkg.id} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-all group">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-dark flex items-center justify-center text-3xl shrink-0 border border-dark-border">
                  {pkg.image}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{pkg.name}</h3>
                        {pkg.badge && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles[pkg.badge] ?? ""}`}>
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-dark-muted text-xs mt-0.5">{pkg.destination} • {pkg.duration}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gold font-bold text-sm">{pkg.price}</p>
                      <p className="text-dark-muted text-[10px] line-through">{pkg.originalPrice}</p>
                      <p className="text-emerald-400 text-[10px] font-medium">Save {savings}%</p>
                    </div>
                  </div>

                  {/* Includes */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pkg.includes.map((inc) => (
                      <span key={inc} className="text-[10px] bg-dark border border-dark-border text-dark-muted px-2 py-0.5 rounded-full">
                        {inc}
                      </span>
                    ))}
                  </div>

                  {/* Sales progress */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-dark-muted text-[10px]">{pkg.sold} sold of {pkg.capacity}</span>
                      <span className="text-dark-muted text-[10px]">{soldPct}% sold</span>
                    </div>
                    <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${soldPct}%` }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      pkg.status === "Active"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                    }`}>
                      {pkg.status}
                    </span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
