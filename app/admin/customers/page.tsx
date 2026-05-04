const customers = [
  { id: "U-0021", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 (555) 0142", country: "USA", joined: "Jan 12, 2025", bookings: 8, spent: "$4,820", status: "Active", tier: "Gold" },
  { id: "U-0020", name: "Michael Chen", email: "m.chen@email.com", phone: "+65 9123 4567", country: "Singapore", joined: "Mar 8, 2025", bookings: 5, spent: "$2,340", status: "Active", tier: "Silver" },
  { id: "U-0019", name: "Emma Wilson", email: "emma.w@email.com", phone: "+44 7700 900234", country: "UK", joined: "Nov 22, 2024", bookings: 12, spent: "$8,950", status: "Active", tier: "Platinum" },
  { id: "U-0018", name: "Raj Patel", email: "raj.p@email.com", phone: "+91 98765 43210", country: "India", joined: "Jul 5, 2024", bookings: 3, spent: "$1,100", status: "Active", tier: "Bronze" },
  { id: "U-0017", name: "Amelia Brown", email: "amelia.b@email.com", phone: "+61 412 345 678", country: "Australia", joined: "Feb 14, 2025", bookings: 6, spent: "$3,200", status: "Active", tier: "Silver" },
  { id: "U-0016", name: "Lucas Smith", email: "l.smith@email.com", phone: "+1 (555) 0198", country: "Canada", joined: "Dec 30, 2024", bookings: 2, spent: "$680", status: "Inactive", tier: "Bronze" },
  { id: "U-0015", name: "Priya Sharma", email: "priya.s@email.com", phone: "+91 87654 32109", country: "India", joined: "Sep 17, 2024", bookings: 18, spent: "$22,400", status: "Active", tier: "Platinum" },
  { id: "U-0014", name: "Thomas Müller", email: "t.muller@email.com", phone: "+49 151 23456789", country: "Germany", joined: "Apr 1, 2025", bookings: 1, spent: "$450", status: "Active", tier: "Bronze" },
];

const tierStyles: Record<string, string> = {
  Platinum: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  Gold: "bg-gold/10 text-gold border-gold/20",
  Silver: "bg-slate-400/10 text-slate-300 border-slate-400/20",
  Bronze: "bg-amber-700/10 text-amber-500 border-amber-700/20",
};

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Inactive: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export default function CustomersPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: "5,621", sub: "+230 this month" },
          { label: "Active", value: "5,104", sub: "90.8% active rate" },
          { label: "Platinum Members", value: "312", sub: "Premium tier" },
          { label: "Avg. Spend", value: "$1,640", sub: "Per customer" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
            <p className="text-emerald-400 text-[10px] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-dark-border">
          <h2 className="text-white font-semibold">All Customers</h2>
          <div className="flex gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-8 pr-3 py-1.5 bg-dark border border-dark-border rounded-lg text-xs text-white placeholder-dark-muted focus:outline-none focus:border-gold w-44"
              />
            </div>
            <select className="bg-dark border border-dark-border text-dark-muted text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold">
              <option>All Tiers</option>
              <option>Platinum</option>
              <option>Gold</option>
              <option>Silver</option>
              <option>Bronze</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {["Customer", "Contact", "Country", "Joined", "Bookings", "Total Spent", "Tier", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-dark-muted text-xs font-medium px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={c.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors ${i === customers.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold text-xs font-bold">{c.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">{c.name}</p>
                        <p className="text-dark-muted text-[10px] font-mono">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white text-xs">{c.email}</p>
                    <p className="text-dark-muted text-[10px]">{c.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-dark-muted text-xs">{c.country}</td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{c.joined}</td>
                  <td className="px-5 py-4 text-white text-xs font-medium text-center">{c.bookings}</td>
                  <td className="px-5 py-4 text-gold text-xs font-semibold">{c.spent}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierStyles[c.tier]}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[c.status]}`}>
                      {c.status}
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
                      <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 hover:border-red-400/40 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
          <span className="text-dark-muted text-xs">Showing 1–8 of 5,621</span>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 703].map((p, i) => (
              <button key={i} className={`px-2.5 h-7 rounded-md text-xs font-medium transition-colors ${p === 1 ? "bg-gold text-dark" : "bg-dark border border-dark-border text-dark-muted hover:text-white"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
