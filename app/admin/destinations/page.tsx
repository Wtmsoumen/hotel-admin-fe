"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/Modal";
import { CardSkeleton, StatSkeleton } from "@/app/components/Skeleton";
import * as api from "@/app/lib/api";

interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  hotels: number;
  image: string;
  trending: boolean;
  avgPrice: string;
  rating: number;
  bookings: number;
}

const MOCK: Destination[] = [
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

const REGIONS = ["All", "Asia", "Europe", "Middle East", "South Asia"];
const EMOJI_OPTIONS = ["🗼", "🌴", "🏙️", "🏔️", "🏛️", "🌿", "🦁", "🐘", "🕌", "🌊", "🏖️", "🏰", "🏝️", "🗺️", "🌍", "🌏", "🌎", "🏜️", "🌋", "⛩️"];

const emptyForm = { name: "", country: "", region: "Asia", image: "🌍", trending: false, avgPrice: "", rating: "4.5" };
type DestForm = typeof emptyForm;
type FormErrors = Partial<Record<keyof DestForm, string>>;

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>(MOCK);
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "live" | "offline">("idle");
  const [regionFilter, setRegionFilter] = useState("All");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Destination | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Destination | null>(null);
  const [form, setForm] = useState<DestForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch from GET /api/v1/destinations/trending
  useEffect(() => {
    let cancelled = false;
    setApiStatus("loading");
    api.fetchTrendingDestinations()
      .then((data) => {
        if (cancelled) return;
        const mapped: Destination[] = data.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.country,
          region: d.region,
          hotels: d.hotelsCount,
          image: d.emoji ?? "🌍",
          trending: d.trending,
          avgPrice: `$${d.avgPricePerNight}/night`,
          rating: d.rating,
          bookings: d.bookingsCount,
        }));
        setDestinations(mapped);
        setApiStatus("live");
      })
      .catch(() => {
        if (!cancelled) setApiStatus("offline");
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = destinations.filter((d) => regionFilter === "All" || d.region === regionFilter);

  function openAdd() { setForm(emptyForm); setErrors({}); setModalMode("add"); }
  function openEdit(d: Destination) {
    setForm({ name: d.name, country: d.country, region: d.region, image: d.image, trending: d.trending, avgPrice: d.avgPrice, rating: String(d.rating) });
    setErrors({}); setEditTarget(d); setModalMode("edit");
  }
  function closeModal() { setModalMode(null); setEditTarget(null); }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!form.avgPrice.trim()) e.avgPrice = "Average price is required";
    const r = parseFloat(form.rating);
    if (isNaN(r) || r < 1 || r > 5) e.rating = "Rating must be 1–5";
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (modalMode === "add") {
      const nd: Destination = {
        id: `D-${String(destinations.length + 1).padStart(2, "0")}`,
        name: form.name.trim(), country: form.country.trim(), region: form.region,
        hotels: 0, image: form.image, trending: form.trending,
        avgPrice: form.avgPrice.trim(), rating: parseFloat(form.rating), bookings: 0,
      };
      setDestinations((p) => [nd, ...p]);
    } else if (editTarget) {
      setDestinations((p) => p.map((d) =>
        d.id === editTarget.id
          ? { ...d, name: form.name.trim(), country: form.country.trim(), region: form.region, image: form.image, trending: form.trending, avgPrice: form.avgPrice.trim(), rating: parseFloat(form.rating) }
          : d
      ));
    }
    closeModal();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setDestinations((p) => p.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function field<K extends keyof DestForm>(key: K, value: DestForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key as keyof FormErrors]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  const inputCls = (err?: string) =>
    `w-full bg-dark border rounded-lg px-3 py-2 text-sm text-foreground placeholder-dark-muted focus:outline-none transition-colors ${err ? "border-red-500/60 focus:border-red-500" : "border-dark-border focus:border-gold"}`;

  const isLoading = apiStatus === "loading" || apiStatus === "idle";

  return (
    <div className="space-y-5">
      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Destinations", value: destinations.length.toString(), sub: "Worldwide" },
            { label: "Trending Now", value: destinations.filter((d) => d.trending).length.toString(), sub: "High demand" },
            { label: "Total Hotels", value: destinations.reduce((a, d) => a + d.hotels, 0).toString(), sub: "Across all cities" },
            { label: "Total Bookings", value: destinations.reduce((a, d) => a + d.bookings, 0).toLocaleString(), sub: "This quarter" },
          ].map((s) => (
            <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
              <p className="text-dark-muted/60 text-[10px] mt-1">{s.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          {REGIONS.map((r) => (
            <button key={r} onClick={() => setRegionFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${r === regionFilter ? "bg-[#D8A95B] text-white" : "bg-dark-card border border-dark-border text-dark-muted hover:text-foreground"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {apiStatus === "offline" && <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-full">Offline mode</span>}
          {apiStatus === "live" && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full">Live · /destinations/trending</span>}
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#D8A95B] hover:bg-[#D8A95B] text-white text-sm font-semibold rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Destination
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((d) => (
            <div key={d.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-gold/30 transition-all group">
              <div className="h-28 bg-gradient-to-br from-dark to-dark-hover flex items-center justify-center relative">
                <span className="text-5xl">{d.image}</span>
                {d.trending && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold bg-[#D8A95B] text-white px-2 py-0.5 rounded-full">Trending</span>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => openEdit(d)} className="p-1.5 rounded-md bg-dark/80 border border-dark-border text-dark-muted hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => setDeleteTarget(d)} className="p-1.5 rounded-md bg-dark/80 border border-dark-border text-dark-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-foreground font-semibold text-sm">{d.name}</h3>
                    <p className="text-dark-muted text-xs">{d.country}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-foreground text-xs font-medium">{d.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dark-border">
                  <div>
                    <p className="text-dark-muted text-[10px]">Hotels</p>
                    <p className="text-foreground text-xs font-medium">{d.hotels}</p>
                  </div>
                  <div>
                    <p className="text-dark-muted text-[10px]">Bookings</p>
                    <p className="text-foreground text-xs font-medium">{d.bookings.toLocaleString()}</p>
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
      )}

      {/* Add / Edit Modal */}
      <Modal open={modalMode === "add" || modalMode === "edit"} onClose={closeModal}
        title={modalMode === "add" ? "Add Destination" : "Edit Destination"} size="md"
        footer={
          <>
            <button onClick={closeModal} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-foreground rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#D8A95B] hover:bg-[#D8A95B] text-white font-semibold rounded-lg text-sm transition-colors">
              {modalMode === "add" ? "Add Destination" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Destination Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Santorini" className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Country *</label>
              <input value={form.country} onChange={(e) => field("country", e.target.value)} placeholder="e.g. Greece" className={inputCls(errors.country)} />
              {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Region</label>
              <select value={form.region} onChange={(e) => field("region", e.target.value)} className={inputCls()}>
                {REGIONS.filter((r) => r !== "All").map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Avg. Price per Night *</label>
              <input value={form.avgPrice} onChange={(e) => field("avgPrice", e.target.value)} placeholder="e.g. $250/night" className={inputCls(errors.avgPrice)} />
              {errors.avgPrice && <p className="text-red-400 text-xs mt-1">{errors.avgPrice}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Rating (1–5) *</label>
              <input type="number" step="0.1" min={1} max={5} value={form.rating} onChange={(e) => field("rating", e.target.value)} className={inputCls(errors.rating)} />
              {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Icon Emoji</label>
              <select value={form.image} onChange={(e) => field("image", e.target.value)} className={inputCls()}>
                {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border border-dark-border rounded-lg px-3">
            <div>
              <p className="text-foreground text-sm font-medium">Mark as Trending</p>
              <p className="text-dark-muted text-xs">Highlight on /destinations/trending endpoint</p>
            </div>
            <button type="button" onClick={() => field("trending", !form.trending)}
              className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${form.trending ? "bg-[#D8A95B]" : "bg-dark border border-dark-border"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.trending ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Destination" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-foreground rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-foreground font-semibold rounded-lg text-sm transition-colors">Delete</button>
          </>
        }
      >
        <p className="text-dark-muted text-sm">
          Are you sure you want to delete <span className="text-foreground font-medium">{deleteTarget?.name}, {deleteTarget?.country}</span>?
        </p>
      </Modal>
    </div>
  );
}
