const rooms = [
  { id: "R-101", name: "Rescue Room", hotel: "Somerset Downtown", type: "Standard", capacity: "2 Adults", beds: "1 King", size: "35 sqm", price: "$220", status: "Available", amenities: ["WiFi", "AC", "TV"] },
  { id: "R-102", name: "Mansion Room", hotel: "Somerset Downtown", type: "Deluxe", capacity: "2 Adults, 1 Child", beds: "1 King", size: "52 sqm", price: "$350", status: "Occupied", amenities: ["WiFi", "AC", "TV", "Mini Bar"] },
  { id: "R-103", name: "Superior Room", hotel: "Comfortable Villa Green", type: "Superior", capacity: "2 Adults", beds: "2 Twin", size: "45 sqm", price: "$180", status: "Available", amenities: ["WiFi", "AC", "TV", "Balcony"] },
  { id: "R-104", name: "Penthouse Suite", hotel: "Grand Palace Hotel", type: "Suite", capacity: "4 Adults", beds: "2 King", size: "120 sqm", price: "$980", status: "Occupied", amenities: ["WiFi", "AC", "TV", "Jacuzzi", "Butler"] },
  { id: "R-105", name: "Garden Villa", hotel: "Comfortable Villa Green", type: "Villa", capacity: "4 Adults, 2 Children", beds: "2 King", size: "200 sqm", price: "$1,200", status: "Maintenance", amenities: ["WiFi", "AC", "TV", "Pool", "Kitchen"] },
  { id: "R-106", name: "Ocean View Room", hotel: "Sunset Beach Villa", type: "Standard", capacity: "2 Adults", beds: "1 Queen", size: "30 sqm", price: "$120", status: "Available", amenities: ["WiFi", "AC", "TV"] },
  { id: "R-107", name: "Royal Suite", hotel: "Royal Heritage Hotel", type: "Suite", capacity: "4 Adults", beds: "2 King", size: "180 sqm", price: "$1,800", status: "Available", amenities: ["WiFi", "AC", "TV", "Jacuzzi", "Butler", "Pool"] },
  { id: "R-108", name: "Forest Cabin", hotel: "Forest Retreat Lodge", type: "Cabin", capacity: "2 Adults", beds: "1 Double", size: "25 sqm", price: "$95", status: "Maintenance", amenities: ["WiFi", "Fireplace"] },
];

const typeColors: Record<string, string> = {
  Standard: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Deluxe: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Superior: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Suite: "bg-gold/10 text-gold border-gold/20",
  Villa: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Cabin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const statusStyles: Record<string, string> = {
  Available: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Occupied: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Maintenance: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

const occupancyData = [
  { type: "Standard", total: 120, occupied: 84 },
  { type: "Deluxe", total: 80, occupied: 62 },
  { type: "Superior", total: 60, occupied: 41 },
  { type: "Suite", total: 24, occupied: 18 },
  { type: "Villa", total: 16, occupied: 10 },
];

export default function RoomsPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", value: "568", sub: "Across 48 hotels" },
          { label: "Available", value: "312", sub: "54.9% availability" },
          { label: "Occupied", value: "198", sub: "34.9% occupancy" },
          { label: "Maintenance", value: "58", sub: "10.2% offline" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
            <p className="text-dark-muted/60 text-[10px] mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Occupancy by Type */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Occupancy by Type</h2>
          <div className="space-y-3">
            {occupancyData.map((d) => {
              const pct = Math.round((d.occupied / d.total) * 100);
              return (
                <div key={d.type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-xs">{d.type}</span>
                    <span className="text-dark-muted text-xs">{d.occupied}/{d.total} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top bar + table */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
            <h2 className="text-white font-semibold">Room Inventory</h2>
            <div className="flex gap-2">
              <select className="bg-dark border border-dark-border text-dark-muted text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold">
                <option>All Types</option>
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
              </select>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gold hover:bg-gold-light text-dark text-xs font-semibold rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add Room
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-border">
                  {["Room", "Hotel", "Type", "Capacity", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-dark-muted text-xs font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, i) => (
                  <tr key={room.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/40 transition-colors ${i === rooms.length - 1 ? "border-0" : ""}`}>
                    <td className="px-4 py-3.5">
                      <p className="text-white text-xs font-medium">{room.name}</p>
                      <p className="text-dark-muted text-[10px] font-mono">{room.id}</p>
                    </td>
                    <td className="px-4 py-3.5 text-dark-muted text-xs truncate max-w-[120px]">{room.hotel}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeColors[room.type] ?? ""}`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-dark-muted text-xs whitespace-nowrap">{room.beds}</td>
                    <td className="px-4 py-3.5 text-white text-xs font-semibold">{room.price}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[room.status]}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1.5">
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
        </div>
      </div>
    </div>
  );
}
