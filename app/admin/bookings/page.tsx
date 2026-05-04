const bookings = [
  { id: "BK-1041", guest: "Sarah Johnson", email: "sarah.j@email.com", hotel: "Somerset Downtown", room: "Deluxe Suite", checkIn: "Apr 22, 2026", checkOut: "Apr 26, 2026", nights: 4, guests: 2, amount: "$1,240", paid: "$1,240", status: "Confirmed", booked: "Apr 18, 2026" },
  { id: "BK-1040", guest: "Michael Chen", email: "m.chen@email.com", hotel: "Comfortable Villa Green", room: "Mansion Room", checkIn: "Apr 21, 2026", checkOut: "Apr 24, 2026", nights: 3, guests: 2, amount: "$890", paid: "$890", status: "Checked In", booked: "Apr 15, 2026" },
  { id: "BK-1039", guest: "Emma Wilson", email: "emma.w@email.com", hotel: "4 Star Hotel", room: "Superior Room", checkIn: "Apr 20, 2026", checkOut: "Apr 22, 2026", nights: 2, guests: 1, amount: "$520", paid: "$520", status: "Confirmed", booked: "Apr 16, 2026" },
  { id: "BK-1038", guest: "Raj Patel", email: "raj.p@email.com", hotel: "5 Star Hotel", room: "Rescue Room", checkIn: "Apr 19, 2026", checkOut: "Apr 23, 2026", nights: 4, guests: 3, amount: "$2,100", paid: "$2,100", status: "Checked Out", booked: "Apr 10, 2026" },
  { id: "BK-1037", guest: "Amelia Brown", email: "amelia.b@email.com", hotel: "Somerset Downtown", room: "Deluxe Suite", checkIn: "Apr 18, 2026", checkOut: "Apr 20, 2026", nights: 2, guests: 2, amount: "$620", paid: "$310", status: "Cancelled", booked: "Apr 12, 2026" },
  { id: "BK-1036", guest: "Lucas Smith", email: "l.smith@email.com", hotel: "3 Star Hotel", room: "Mansion Room", checkIn: "Apr 17, 2026", checkOut: "Apr 19, 2026", nights: 2, guests: 1, amount: "$340", paid: "$340", status: "Checked Out", booked: "Apr 14, 2026" },
  { id: "BK-1035", guest: "Priya Sharma", email: "priya.s@email.com", hotel: "Royal Heritage Hotel", room: "Royal Suite", checkIn: "Apr 25, 2026", checkOut: "Apr 29, 2026", nights: 4, guests: 2, amount: "$7,200", paid: "$7,200", status: "Confirmed", booked: "Apr 19, 2026" },
  { id: "BK-1034", guest: "Thomas Müller", email: "t.muller@email.com", hotel: "Mountain View Resort", room: "Garden Villa", checkIn: "May 1, 2026", checkOut: "May 5, 2026", nights: 4, guests: 4, amount: "$3,400", paid: "$1,700", status: "Pending", booked: "Apr 20, 2026" },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  "Checked In": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  "Checked Out": "bg-dark-muted/20 text-dark-muted border border-dark-border",
  Cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

export default function BookingsPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Bookings", value: "1,284", color: "text-white" },
          { label: "Confirmed", value: "486", color: "text-blue-400" },
          { label: "Checked In", value: "312", color: "text-emerald-400" },
          { label: "Checked Out", value: "421", color: "text-dark-muted" },
          { label: "Cancelled", value: "65", color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter & Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-dark-border">
          <div className="flex gap-2 flex-wrap">
            {["All", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Pending"].map((f) => (
              <button
                key={f}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  f === "All"
                    ? "bg-gold text-dark"
                    : "bg-dark border border-dark-border text-dark-muted hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search bookings..."
                className="pl-8 pr-3 py-1.5 bg-dark border border-dark-border rounded-lg text-xs text-white placeholder-dark-muted focus:outline-none focus:border-gold w-44"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-dark border border-dark-border text-dark-muted hover:text-white text-xs rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {["ID", "Guest", "Hotel & Room", "Check-in", "Check-out", "Nights", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-dark-muted text-xs font-medium px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors ${i === bookings.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-4 text-gold text-xs font-mono">{b.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-white text-xs font-medium">{b.guest}</p>
                    <p className="text-dark-muted text-[10px]">{b.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white text-xs">{b.hotel}</p>
                    <p className="text-dark-muted text-[10px]">{b.room}</p>
                  </td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{b.checkIn}</td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{b.checkOut}</td>
                  <td className="px-5 py-4 text-white text-xs text-center">{b.nights}</td>
                  <td className="px-5 py-4">
                    <p className="text-white text-xs font-semibold">{b.amount}</p>
                    <p className="text-dark-muted text-[10px]">Paid: {b.paid}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-dark-muted text-xs">Showing 1–8 of 1,284</span>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 161].map((p, i) => (
              <button
                key={i}
                className={`px-2.5 h-7 rounded-md text-xs font-medium transition-colors ${
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
