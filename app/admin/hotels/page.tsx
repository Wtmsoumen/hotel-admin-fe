"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Modal from "@/app/components/Modal";
import { TableRowSkeleton, StatSkeleton } from "@/app/components/Skeleton";
import * as api from "@/app/lib/api";
import type { HotelListParams } from "@/app/lib/types";

interface Hotel {
  id: string;
  name: string;
  location: string;
  category: string;
  rooms: number;
  rating: number;
  reviews: number;
  status: string;
  price: string;
  image: string;
}

const MOCK: Hotel[] = [
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

const CATEGORIES = ["All", "5 Star", "4 Star", "3 Star"];

const emptyForm = { name: "", location: "", category: "5 Star", rooms: "", price: "", status: "Active" };
type HotelForm = typeof emptyForm;
type FormErrors = Partial<Record<keyof HotelForm, string>>;

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function mapApiHotel(h: Awaited<ReturnType<typeof api.fetchHotels>>["results"][0]): Hotel {
  return {
    id: h.id,
    name: h.name,
    location: h.location,
    category: h.category,
    rooms: h.roomsCount,
    rating: h.rating,
    reviews: h.reviewsCount,
    status: h.status === "active" ? "Active" : h.status === "inactive" ? "Inactive" : "Maintenance",
    price: `$${h.pricePerNight}/night`,
    image: initials(h.name),
  };
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>(MOCK);
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "live" | "offline">("idle");
  const [filterCat, setFilterCat] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(MOCK.length);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Hotel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Hotel | null>(null);
  const [form, setForm] = useState<HotelForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // ── Debounce search input ──
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // ── Fetch from API whenever filter/search/page changes ──
  const loadHotels = useCallback(async () => {
    setApiStatus("loading");
    const params: HotelListParams = { page: String(page), limit: "8" };
    if (debouncedSearch) params.location = debouncedSearch;
    if (filterCat !== "All") params.rating = filterCat.split(" ")[0]; // "5 Star" → "5"

    try {
      const data = await api.fetchHotels(params);
      setHotels(data.results.map(mapApiHotel));
      setTotal(data.total);
      setApiStatus("live");
    } catch {
      // Fall back to client-side filter of mock data
      const filtered = MOCK.filter((h) => {
        const matchesCat = filterCat === "All" || h.category === filterCat;
        const q = debouncedSearch.toLowerCase();
        return matchesCat && (!q || h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
      });
      setHotels(filtered);
      setTotal(filtered.length);
      setApiStatus("offline");
    }
  }, [filterCat, debouncedSearch, page]);

  useEffect(() => { loadHotels(); }, [loadHotels]);

  // ── Modal helpers ──
  function openAdd() { setForm(emptyForm); setErrors({}); setModalMode("add"); }
  function openEdit(h: Hotel) {
    setForm({ name: h.name, location: h.location, category: h.category, rooms: String(h.rooms), price: h.price.replace("/night", ""), status: h.status });
    setErrors({}); setEditTarget(h); setModalMode("edit");
  }
  function closeModal() { setModalMode(null); setEditTarget(null); }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Hotel name is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.rooms || isNaN(Number(form.rooms)) || Number(form.rooms) < 1) e.rooms = "Enter a valid room count";
    if (!form.price.trim()) e.price = "Price is required";
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (modalMode === "add") {
      const h: Hotel = {
        id: `H-${String(hotels.length + 1).padStart(3, "0")}`,
        name: form.name.trim(), location: form.location.trim(), category: form.category,
        rooms: Number(form.rooms), rating: 0, reviews: 0, status: form.status,
        price: form.price.includes("/night") ? form.price : `${form.price}/night`,
        image: initials(form.name),
      };
      setHotels((prev) => [h, ...prev]);
      setTotal((t) => t + 1);
    } else if (editTarget) {
      setHotels((prev) => prev.map((h) =>
        h.id === editTarget.id
          ? { ...h, name: form.name.trim(), location: form.location.trim(), category: form.category, rooms: Number(form.rooms), status: form.status, price: form.price.includes("/night") ? form.price : `${form.price}/night`, image: initials(form.name) }
          : h
      ));
    }
    closeModal();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    setTotal((t) => t - 1);
    setDeleteTarget(null);
  }

  function field(key: keyof HotelForm, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  const inputCls = (err?: string) =>
    `w-full bg-dark border rounded-lg px-3 py-2 text-sm text-white placeholder-dark-muted focus:outline-none transition-colors ${err ? "border-red-500/60 focus:border-red-500" : "border-dark-border focus:border-gold"}`;

  const isLoading = apiStatus === "loading" || apiStatus === "idle";

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => { setFilterCat(c); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${c === filterCat ? "bg-gold text-dark" : "bg-dark-card border border-dark-border text-dark-muted hover:text-white hover:border-gold/50"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          {apiStatus === "offline" && (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-full">
              Offline mode
            </span>
          )}
          {apiStatus === "live" && (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full">
              Live data
            </span>
          )}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by location..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-white placeholder-dark-muted focus:outline-none focus:border-gold transition-colors w-52" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-light text-dark text-sm font-semibold rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Hotel
          </button>
        </div>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Hotels", value: total.toString(), icon: "🏨" },
            { label: "Active Hotels", value: hotels.filter((h) => h.status === "Active").length.toString(), icon: "✅" },
            { label: "Avg Rating", value: hotels.length ? (hotels.reduce((a, h) => a + h.rating, 0) / hotels.length).toFixed(1) : "—", icon: "⭐" },
            { label: "Total Rooms", value: hotels.reduce((a, h) => a + h.rooms, 0).toString(), icon: "🛏️" },
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
      )}

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border flex items-center justify-between">
          <h2 className="text-white font-semibold">All Hotels</h2>
          <span className="text-dark-muted text-xs">{isLoading ? "Loading…" : `${hotels.length} of ${total}`}</span>
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
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={8} />)
                : hotels.map((hotel, i) => (
                  <tr key={hotel.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors ${i === hotels.length - 1 ? "border-0" : ""}`}>
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
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[hotel.status]}`}>{hotel.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(hotel)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 hover:border-blue-400/40 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteTarget(hotel)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 hover:border-red-400/40 transition-colors">
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

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-dark-muted text-xs">Showing {hotels.length} of {total}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 h-7 rounded-md text-xs font-medium bg-dark border border-dark-border text-dark-muted hover:text-white disabled:opacity-40 transition-colors"
            >
              ←
            </button>
            <span className="px-2.5 h-7 flex items-center rounded-md text-xs font-medium bg-gold text-dark">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={hotels.length < 8}
              className="px-2.5 h-7 rounded-md text-xs font-medium bg-dark border border-dark-border text-dark-muted hover:text-white disabled:opacity-40 transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalMode === "add" || modalMode === "edit"} onClose={closeModal}
        title={modalMode === "add" ? "Add New Hotel" : "Edit Hotel"} size="lg"
        footer={
          <>
            <button onClick={closeModal} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-gold hover:bg-gold-light text-dark font-semibold rounded-lg text-sm transition-colors">
              {modalMode === "add" ? "Add Hotel" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Hotel Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Grand Seaside Resort" className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Location *</label>
              <input value={form.location} onChange={(e) => field("location", e.target.value)} placeholder="e.g. Bali, Indonesia" className={inputCls(errors.location)} />
              {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => field("category", e.target.value)} className={inputCls()}>
                <option>5 Star</option><option>4 Star</option><option>3 Star</option><option>2 Star</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => field("status", e.target.value)} className={inputCls()}>
                <option>Active</option><option>Inactive</option><option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Number of Rooms *</label>
              <input type="number" min={1} value={form.rooms} onChange={(e) => field("rooms", e.target.value)} placeholder="e.g. 50" className={inputCls(errors.rooms)} />
              {errors.rooms && <p className="text-red-400 text-xs mt-1">{errors.rooms}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Price per Night *</label>
              <input value={form.price} onChange={(e) => field("price", e.target.value)} placeholder="e.g. $250/night" className={inputCls(errors.price)} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Hotel" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-colors">Delete</button>
          </>
        }
      >
        <p className="text-dark-muted text-sm">
          Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
