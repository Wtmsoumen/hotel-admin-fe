"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/app/components/Modal";
import { TableRowSkeleton } from "@/app/components/Skeleton";
import * as api from "@/app/lib/api";

interface Room {
  id: string;
  name: string;
  hotel: string;
  hotelId: string;
  type: string;
  capacity: string;
  beds: string;
  size: string;
  price: string;
  status: string;
  amenities: string[];
}

const HOTEL_OPTIONS = [
  { id: "H-001", name: "Somerset Downtown" },
  { id: "H-002", name: "Comfortable Villa Green" },
  { id: "H-003", name: "Grand Palace Hotel" },
  { id: "H-004", name: "Mountain View Resort" },
  { id: "H-005", name: "Sunset Beach Villa" },
  { id: "H-006", name: "City Center Inn" },
  { id: "H-007", name: "Royal Heritage Hotel" },
  { id: "H-008", name: "Forest Retreat Lodge" },
];

const MOCK_ROOMS: Room[] = [
  { id: "R-101", name: "Rescue Room", hotel: "Somerset Downtown", hotelId: "H-001", type: "Standard", capacity: "2 Adults", beds: "1 King", size: "35 sqm", price: "$220", status: "Available", amenities: ["WiFi", "AC", "TV"] },
  { id: "R-102", name: "Mansion Room", hotel: "Somerset Downtown", hotelId: "H-001", type: "Deluxe", capacity: "2 Adults, 1 Child", beds: "1 King", size: "52 sqm", price: "$350", status: "Occupied", amenities: ["WiFi", "AC", "TV", "Mini Bar"] },
  { id: "R-103", name: "Superior Room", hotel: "Comfortable Villa Green", hotelId: "H-002", type: "Superior", capacity: "2 Adults", beds: "2 Twin", size: "45 sqm", price: "$180", status: "Available", amenities: ["WiFi", "AC", "TV", "Balcony"] },
  { id: "R-104", name: "Penthouse Suite", hotel: "Grand Palace Hotel", hotelId: "H-003", type: "Suite", capacity: "4 Adults", beds: "2 King", size: "120 sqm", price: "$980", status: "Occupied", amenities: ["WiFi", "AC", "TV", "Jacuzzi", "Butler"] },
  { id: "R-105", name: "Garden Villa", hotel: "Comfortable Villa Green", hotelId: "H-002", type: "Villa", capacity: "4 Adults, 2 Children", beds: "2 King", size: "200 sqm", price: "$1,200", status: "Maintenance", amenities: ["WiFi", "AC", "TV", "Pool", "Kitchen"] },
  { id: "R-106", name: "Ocean View Room", hotel: "Sunset Beach Villa", hotelId: "H-005", type: "Standard", capacity: "2 Adults", beds: "1 Queen", size: "30 sqm", price: "$120", status: "Available", amenities: ["WiFi", "AC", "TV"] },
  { id: "R-107", name: "Royal Suite", hotel: "Royal Heritage Hotel", hotelId: "H-007", type: "Suite", capacity: "4 Adults", beds: "2 King", size: "180 sqm", price: "$1,800", status: "Available", amenities: ["WiFi", "AC", "TV", "Jacuzzi", "Butler", "Pool"] },
  { id: "R-108", name: "Forest Cabin", hotel: "Forest Retreat Lodge", hotelId: "H-008", type: "Cabin", capacity: "2 Adults", beds: "1 Double", size: "25 sqm", price: "$95", status: "Maintenance", amenities: ["WiFi", "Fireplace"] },
];

const ROOM_TYPES = ["Standard", "Deluxe", "Superior", "Suite", "Villa", "Cabin"];
const ALL_AMENITIES = ["WiFi", "AC", "TV", "Mini Bar", "Balcony", "Jacuzzi", "Butler", "Pool", "Kitchen", "Fireplace", "Gym", "Spa"];

const typeColors: Record<string, string> = {
  Standard: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Deluxe: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Superior: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Suite: "bg-[#D8A95B]/10 text-gold border-gold/20",
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

function mapApiRoom(r: Awaited<ReturnType<typeof api.fetchHotelRooms>>[0], hotel: typeof HOTEL_OPTIONS[0]): Room {
  return {
    id: r.id,
    name: r.name,
    hotel: hotel.name,
    hotelId: hotel.id,
    type: r.type,
    capacity: r.capacity,
    beds: r.bedConfiguration,
    size: `${r.sizeSquareMeters} sqm`,
    price: `$${r.pricePerNight}`,
    status: r.status === "available" ? "Available" : r.status === "occupied" ? "Occupied" : "Maintenance",
    amenities: r.amenities,
  };
}

const emptyForm = {
  name: "", hotelId: HOTEL_OPTIONS[0].id, type: "Standard",
  capacity: "", beds: "", size: "", price: "", status: "Available", amenities: [] as string[],
};
type RoomForm = typeof emptyForm;
type FormErrors = Partial<Record<keyof RoomForm, string>>;

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [filterType, setFilterType] = useState("All Types");
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "live" | "offline">("idle");
  const [availableAmenities, setAvailableAmenities] = useState<string[]>(ALL_AMENITIES);

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Room | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch rooms for selected hotel from API
  const loadRooms = useCallback(async () => {
    if (!selectedHotelId) {
      setRooms(MOCK_ROOMS);
      setApiStatus("offline");
      return;
    }
    setApiStatus("loading");
    const hotel = HOTEL_OPTIONS.find((h) => h.id === selectedHotelId)!;
    try {
      const [roomData, amenityData] = await Promise.all([
        api.fetchHotelRooms(selectedHotelId),
        api.fetchHotelAmenities(selectedHotelId).catch(() => []),
      ]);
      setRooms(roomData.map((r) => mapApiRoom(r, hotel)));
      if (amenityData.length > 0) setAvailableAmenities(amenityData.map((a) => a.name));
      setApiStatus("live");
    } catch {
      setRooms(MOCK_ROOMS.filter((r) => r.hotelId === selectedHotelId));
      setApiStatus("offline");
    }
  }, [selectedHotelId]);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  const filtered = rooms.filter((r) => filterType === "All Types" || r.type === filterType);

  function openAdd() { setForm(emptyForm); setErrors({}); setModalMode("add"); }
  function openEdit(room: Room) {
    setForm({ name: room.name, hotelId: room.hotelId, type: room.type, capacity: room.capacity, beds: room.beds, size: room.size, price: room.price, status: room.status, amenities: [...room.amenities] });
    setErrors({}); setEditTarget(room); setModalMode("edit");
  }
  function closeModal() { setModalMode(null); setEditTarget(null); }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Room name is required";
    if (!form.capacity.trim()) e.capacity = "Capacity is required";
    if (!form.beds.trim()) e.beds = "Bed configuration is required";
    if (!form.price.trim()) e.price = "Price is required";
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const hotel = HOTEL_OPTIONS.find((h) => h.id === form.hotelId)!;
    if (modalMode === "add") {
      const nr: Room = {
        id: `R-${String(rooms.length + 100 + 1)}`,
        name: form.name.trim(), hotel: hotel.name, hotelId: form.hotelId,
        type: form.type, capacity: form.capacity.trim(), beds: form.beds.trim(),
        size: form.size.trim() || "N/A", price: form.price.trim(),
        status: form.status, amenities: form.amenities,
      };
      setRooms((prev) => [nr, ...prev]);
    } else if (editTarget) {
      setRooms((prev) => prev.map((r) =>
        r.id === editTarget.id
          ? { ...r, name: form.name.trim(), hotel: hotel.name, hotelId: form.hotelId, type: form.type, capacity: form.capacity.trim(), beds: form.beds.trim(), size: form.size.trim() || r.size, price: form.price.trim(), status: form.status, amenities: form.amenities }
          : r
      ));
    }
    closeModal();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setRooms((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function field<K extends keyof RoomForm>(key: K, value: RoomForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key as keyof FormErrors]) setErrors((p) => ({ ...p, [key]: undefined }));
  }
  function toggleAmenity(a: string) {
    setForm((p) => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter((x) => x !== a) : [...p.amenities, a] }));
  }

  const inputCls = (err?: string) =>
    `w-full bg-dark border rounded-lg px-3 py-2 text-sm text-foreground placeholder-dark-muted focus:outline-none transition-colors ${err ? "border-red-500/60 focus:border-red-500" : "border-dark-border focus:border-gold"}`;

  const isLoading = apiStatus === "loading";

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Rooms", value: rooms.length.toString(), sub: `Across ${HOTEL_OPTIONS.length} hotels` },
          { label: "Available", value: rooms.filter((r) => r.status === "Available").length.toString(), sub: "" },
          { label: "Occupied", value: rooms.filter((r) => r.status === "Occupied").length.toString(), sub: "" },
          { label: "Maintenance", value: rooms.filter((r) => r.status === "Maintenance").length.toString(), sub: "" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
            {s.sub && <p className="text-dark-muted/60 text-[10px] mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Occupancy */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-5">
          <h2 className="text-foreground font-semibold mb-4">Occupancy by Type</h2>
          <div className="space-y-3">
            {occupancyData.map((d) => {
              const pct = Math.round((d.occupied / d.total) * 100);
              return (
                <div key={d.type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground text-xs">{d.type}</span>
                    <span className="text-dark-muted text-xs">{d.occupied}/{d.total} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#D8A95B]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground font-semibold">Room Inventory</h2>
              {apiStatus === "offline" && <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">Offline</span>}
              {apiStatus === "live" && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Live</span>}
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Hotel selector — drives API call to /hotels/{id}/rooms */}
              <select
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
                className="bg-dark border border-dark-border text-dark-muted text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold"
              >
                <option value="">All Hotels</option>
                {HOTEL_OPTIONS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="bg-dark border border-dark-border text-dark-muted text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold">
                <option>All Types</option>
                {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D8A95B] hover:bg-[#D8A95B] text-white text-xs font-semibold rounded-lg transition-colors">
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
                  {["Room", "Hotel", "Type", "Beds", "Price", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-dark-muted text-xs font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                  : filtered.map((room, i) => (
                    <tr key={room.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/40 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                      <td className="px-4 py-3.5">
                        <p className="text-foreground text-xs font-medium">{room.name}</p>
                        <p className="text-dark-muted text-[10px] font-mono">{room.id}</p>
                      </td>
                      <td className="px-4 py-3.5 text-dark-muted text-xs truncate max-w-[120px]">{room.hotel}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${typeColors[room.type] ?? ""}`}>{room.type}</span>
                      </td>
                      <td className="px-4 py-3.5 text-dark-muted text-xs whitespace-nowrap">{room.beds}</td>
                      <td className="px-4 py-3.5 text-foreground text-xs font-semibold">{room.price}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[room.status]}`}>{room.status}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(room)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 hover:border-blue-400/40 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => setDeleteTarget(room)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 hover:border-red-400/40 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalMode === "add" || modalMode === "edit"} onClose={closeModal}
        title={modalMode === "add" ? "Add New Room" : "Edit Room"} size="lg"
        footer={
          <>
            <button onClick={closeModal} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-foreground rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#D8A95B] hover:bg-[#D8A95B] text-white font-semibold rounded-lg text-sm transition-colors">
              {modalMode === "add" ? "Add Room" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Room Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Ocean View Suite" className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Hotel</label>
              <select value={form.hotelId} onChange={(e) => field("hotelId", e.target.value)} className={inputCls()}>
                {HOTEL_OPTIONS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Room Type</label>
              <select value={form.type} onChange={(e) => field("type", e.target.value)} className={inputCls()}>
                {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => field("status", e.target.value)} className={inputCls()}>
                <option>Available</option><option>Occupied</option><option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Capacity *</label>
              <input value={form.capacity} onChange={(e) => field("capacity", e.target.value)} placeholder="e.g. 2 Adults, 1 Child" className={inputCls(errors.capacity)} />
              {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Bed Configuration *</label>
              <input value={form.beds} onChange={(e) => field("beds", e.target.value)} placeholder="e.g. 1 King Bed" className={inputCls(errors.beds)} />
              {errors.beds && <p className="text-red-400 text-xs mt-1">{errors.beds}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Room Size</label>
              <input value={form.size} onChange={(e) => field("size", e.target.value)} placeholder="e.g. 45 sqm" className={inputCls()} />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Price per Night *</label>
              <input value={form.price} onChange={(e) => field("price", e.target.value)} placeholder="e.g. $280" className={inputCls(errors.price)} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
          <div>
            <label className="block text-dark-muted text-xs font-medium mb-2">
              Amenities
              {selectedHotelId && apiStatus === "live" && <span className="ml-2 text-emerald-400">(from API)</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((a) => {
                const checked = form.amenities.includes(a);
                return (
                  <button key={a} type="button" onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${checked ? "bg-[#D8A95B]/20 text-gold border-gold/40" : "bg-dark border-dark-border text-dark-muted hover:border-gold/30 hover:text-foreground"}`}>
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Room" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-foreground rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-foreground font-semibold rounded-lg text-sm transition-colors">Delete</button>
          </>
        }
      >
        <p className="text-dark-muted text-sm">
          Are you sure you want to delete <span className="text-foreground font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
