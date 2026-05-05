"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";

interface Package {
  id: string;
  name: string;
  destination: string;
  duration: string;
  hotels: string;
  price: string;
  originalPrice: string;
  includes: string[];
  sold: number;
  capacity: number;
  status: string;
  badge: string;
  image: string;
}

const initialPackages: Package[] = [
  { id: "PKG-01", name: "Bali Escape", destination: "Bali, Indonesia", duration: "7 Nights", hotels: "Comfortable Villa Green", price: "$1,200", originalPrice: "$1,800", includes: ["Flights", "Hotel", "Breakfast", "Tours"], sold: 148, capacity: 200, status: "Active", badge: "Best Seller", image: "🌴" },
  { id: "PKG-02", name: "Paris Romance", destination: "Paris, France", duration: "5 Nights", hotels: "Grand Palace Hotel", price: "$2,400", originalPrice: "$3,200", includes: ["Flights", "Hotel", "Breakfast", "City Tour"], sold: 86, capacity: 150, status: "Active", badge: "Popular", image: "🗼" },
  { id: "PKG-03", name: "Dubai Luxury", destination: "Dubai, UAE", duration: "6 Nights", hotels: "Royal Heritage Hotel", price: "$3,800", originalPrice: "$5,000", includes: ["Flights", "Hotel", "All Meals", "Desert Safari"], sold: 42, capacity: 100, status: "Active", badge: "Premium", image: "🏙️" },
  { id: "PKG-04", name: "Thailand Adventure", destination: "Bangkok & Phuket", duration: "10 Nights", hotels: "Sunset Beach Villa", price: "$1,500", originalPrice: "$2,200", includes: ["Flights", "Hotel", "Breakfast", "Day Trips"], sold: 220, capacity: 300, status: "Active", badge: "Best Value", image: "🐘" },
  { id: "PKG-05", name: "Swiss Alps Getaway", destination: "Switzerland", duration: "8 Nights", hotels: "Mountain View Resort", price: "$4,200", originalPrice: "$5,500", includes: ["Flights", "Hotel", "All Meals", "Ski Pass"], sold: 31, capacity: 80, status: "Active", badge: "", image: "🏔️" },
  { id: "PKG-06", name: "India Discovery", destination: "Delhi, Agra, Jaipur", duration: "7 Nights", hotels: "Multiple Hotels", price: "$950", originalPrice: "$1,400", includes: ["Flights", "Hotel", "Breakfast", "Guide"], sold: 94, capacity: 200, status: "Active", badge: "New", image: "🕌" },
  { id: "PKG-07", name: "Greek Islands Cruise", destination: "Athens & Santorini", duration: "9 Nights", hotels: "Boutique Hotels", price: "$2,800", originalPrice: "$3,600", includes: ["Flights", "Hotel", "Breakfast", "Ferry"], sold: 58, capacity: 120, status: "Active", badge: "", image: "🏛️" },
  { id: "PKG-08", name: "Singapore Experience", destination: "Singapore", duration: "4 Nights", hotels: "City Center Inn", price: "$1,100", originalPrice: "$1,600", includes: ["Flights", "Hotel", "Breakfast"], sold: 172, capacity: 250, status: "Inactive", badge: "", image: "🦁" },
];

const badgeOptions = ["", "Best Seller", "Popular", "Premium", "Best Value", "New"];
const includeOptions = ["Flights", "Hotel", "Breakfast", "All Meals", "Tours", "City Tour", "Day Trips", "Desert Safari", "Ski Pass", "Ferry", "Guide", "Airport Transfer", "Spa Access"];
const emojiOptions = ["🌴", "🗼", "🏙️", "🐘", "🏔️", "🕌", "🏛️", "🦁", "🏖️", "🏰", "🌿", "🌊"];

const badgeStyles: Record<string, string> = {
  "Best Seller": "bg-[#D8A95B]/10 text-gold border-gold/20",
  Popular: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Premium: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Best Value": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  New: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const emptyForm = {
  name: "", destination: "", duration: "", hotels: "", price: "",
  originalPrice: "", includes: [] as string[], capacity: "", status: "Active", badge: "", image: "🌍",
};

type PackageForm = typeof emptyForm;
type FormErrors = Partial<Record<keyof PackageForm, string>>;

function parsePrice(str: string): number {
  return parseInt(str.replace(/[$,]/g, "")) || 0;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Package | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Package | null>(null);
  const [form, setForm] = useState<PackageForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const filtered = packages.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q);
  });

  function openAdd() { setForm(emptyForm); setErrors({}); setModalMode("add"); }

  function openEdit(pkg: Package) {
    setForm({
      name: pkg.name, destination: pkg.destination, duration: pkg.duration,
      hotels: pkg.hotels, price: pkg.price, originalPrice: pkg.originalPrice,
      includes: [...pkg.includes], capacity: String(pkg.capacity),
      status: pkg.status, badge: pkg.badge, image: pkg.image,
    });
    setErrors({});
    setEditTarget(pkg);
    setModalMode("edit");
  }

  function closeModal() { setModalMode(null); setEditTarget(null); }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Package name is required";
    if (!form.destination.trim()) e.destination = "Destination is required";
    if (!form.duration.trim()) e.duration = "Duration is required";
    if (!form.price.trim()) e.price = "Price is required";
    if (!form.originalPrice.trim()) e.originalPrice = "Original price is required";
    if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) < 1)
      e.capacity = "Valid capacity is required";
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    if (modalMode === "add") {
      const np: Package = {
        id: `PKG-${String(packages.length + 1).padStart(2, "0")}`,
        name: form.name.trim(), destination: form.destination.trim(),
        duration: form.duration.trim(), hotels: form.hotels.trim() || "Multiple Hotels",
        price: form.price.trim(), originalPrice: form.originalPrice.trim(),
        includes: form.includes, sold: 0, capacity: Number(form.capacity),
        status: form.status, badge: form.badge, image: form.image,
      };
      setPackages((prev) => [np, ...prev]);
    } else if (modalMode === "edit" && editTarget) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? { ...p, name: form.name.trim(), destination: form.destination.trim(), duration: form.duration.trim(), hotels: form.hotels.trim() || p.hotels, price: form.price.trim(), originalPrice: form.originalPrice.trim(), includes: form.includes, capacity: Number(form.capacity), status: form.status, badge: form.badge, image: form.image }
            : p
        )
      );
    }
    closeModal();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function field<K extends keyof PackageForm>(key: K, value: PackageForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleInclude(item: string) {
    setForm((prev) => ({
      ...prev,
      includes: prev.includes.includes(item)
        ? prev.includes.filter((i) => i !== item)
        : [...prev.includes, item],
    }));
  }

  const inputCls = (err?: string) =>
    `w-full bg-dark border rounded-lg px-3 py-2 text-sm text-foreground placeholder-dark-muted focus:outline-none transition-colors ${err ? "border-red-500/60 focus:border-red-500" : "border-dark-border focus:border-gold"
    }`;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Packages", value: packages.filter((p) => p.status === "Active").length.toString(), sub: "Across all destinations" },
          { label: "Total Sold", value: packages.reduce((a, p) => a + p.sold, 0).toString(), sub: "This quarter" },
          { label: "Total Capacity", value: packages.reduce((a, p) => a + p.capacity, 0).toString(), sub: "Available spots" },
          { label: "Avg. Discount", value: `${Math.round(packages.reduce((a, p) => a + ((parsePrice(p.originalPrice) - parsePrice(p.price)) / parsePrice(p.originalPrice)) * 100, 0) / packages.length)}%`, sub: "Off regular price" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-sm text-foreground placeholder-dark-muted focus:outline-none focus:border-gold w-52"
          />
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-[#D8A95B] hover:bg-[#D8A95B] text-white text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Package
        </button>
      </div>

      {/* Packages grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((pkg) => {
          const soldPct = Math.round((pkg.sold / pkg.capacity) * 100);
          const savings = Math.round(((parsePrice(pkg.originalPrice) - parsePrice(pkg.price)) / parsePrice(pkg.originalPrice)) * 100);

          return (
            <div key={pkg.id} className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-dark flex items-center justify-center text-3xl shrink-0 border border-dark-border">
                  {pkg.image}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-foreground font-semibold text-sm">{pkg.name}</h3>
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

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pkg.includes.map((inc) => (
                      <span key={inc} className="text-[10px] bg-dark border border-dark-border text-dark-muted px-2 py-0.5 rounded-full">
                        {inc}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-dark-muted text-[10px]">{pkg.sold} sold of {pkg.capacity}</span>
                      <span className="text-dark-muted text-[10px]">{soldPct}% sold</span>
                    </div>
                    <div className="h-1.5 bg-dark rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[#D8A95B]" style={{ width: `${soldPct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${pkg.status === "Active"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/15 text-red-400 border border-red-500/20"
                      }`}>
                      {pkg.status}
                    </span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(pkg)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeleteTarget(pkg)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 transition-colors">
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

      {/* Add / Edit Modal */}
      <Modal
        open={modalMode === "add" || modalMode === "edit"}
        onClose={closeModal}
        title={modalMode === "add" ? "Create Package" : "Edit Package"}
        size="xl"
        footer={
          <>
            <button onClick={closeModal} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-foreground rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-[#D8A95B] hover:bg-[#D8A95B] text-white font-semibold rounded-lg text-sm transition-colors">
              {modalMode === "add" ? "Create Package" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Package Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Bali Escape" className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Destination *</label>
              <input value={form.destination} onChange={(e) => field("destination", e.target.value)} placeholder="e.g. Bali, Indonesia" className={inputCls(errors.destination)} />
              {errors.destination && <p className="text-red-400 text-xs mt-1">{errors.destination}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Duration *</label>
              <input value={form.duration} onChange={(e) => field("duration", e.target.value)} placeholder="e.g. 7 Nights" className={inputCls(errors.duration)} />
              {errors.duration && <p className="text-red-400 text-xs mt-1">{errors.duration}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Hotel(s)</label>
              <input value={form.hotels} onChange={(e) => field("hotels", e.target.value)} placeholder="e.g. Grand Palace Hotel" className={inputCls()} />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Sale Price *</label>
              <input value={form.price} onChange={(e) => field("price", e.target.value)} placeholder="e.g. $1,200" className={inputCls(errors.price)} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Original Price *</label>
              <input value={form.originalPrice} onChange={(e) => field("originalPrice", e.target.value)} placeholder="e.g. $1,800" className={inputCls(errors.originalPrice)} />
              {errors.originalPrice && <p className="text-red-400 text-xs mt-1">{errors.originalPrice}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Capacity *</label>
              <input type="number" min={1} value={form.capacity} onChange={(e) => field("capacity", e.target.value)} placeholder="e.g. 200" className={inputCls(errors.capacity)} />
              {errors.capacity && <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Icon</label>
              <select value={form.image} onChange={(e) => field("image", e.target.value)} className={inputCls()}>
                {emojiOptions.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Badge</label>
              <select value={form.badge} onChange={(e) => field("badge", e.target.value)} className={inputCls()}>
                {badgeOptions.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => field("status", e.target.value)} className={inputCls()}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Includes */}
          <div>
            <label className="block text-dark-muted text-xs font-medium mb-2">What&apos;s Included</label>
            <div className="flex flex-wrap gap-2">
              {includeOptions.map((item) => {
                const checked = form.includes.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleInclude(item)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${checked ? "bg-[#D8A95B]/20 text-gold border-gold/40" : "bg-dark border-dark-border text-dark-muted hover:border-gold/30 hover:text-foreground"
                      }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Package"
        size="sm"
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
