"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";
import * as api from "@/app/lib/api";

interface Booking {
  id: string;
  guest: string;
  email: string;
  hotel: string;
  hotelId: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  amount: string;
  paid: string;
  status: string;
  booked: string;
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

const ROOM_OPTIONS = ["Standard Room", "Deluxe Suite", "Superior Room", "Penthouse Suite", "Garden Villa", "Ocean View Room", "Royal Suite", "Mansion Room", "Rescue Room", "Forest Cabin"];

const initialBookings: Booking[] = [
  { id: "BK-1041", guest: "Sarah Johnson", email: "sarah.j@email.com", hotel: "Somerset Downtown", hotelId: "H-001", room: "Deluxe Suite", checkIn: "Apr 22, 2026", checkOut: "Apr 26, 2026", nights: 4, guests: 2, amount: "$1,240", paid: "$1,240", status: "Confirmed", booked: "Apr 18, 2026" },
  { id: "BK-1040", guest: "Michael Chen", email: "m.chen@email.com", hotel: "Comfortable Villa Green", hotelId: "H-002", room: "Mansion Room", checkIn: "Apr 21, 2026", checkOut: "Apr 24, 2026", nights: 3, guests: 2, amount: "$890", paid: "$890", status: "Checked In", booked: "Apr 15, 2026" },
  { id: "BK-1039", guest: "Emma Wilson", email: "emma.w@email.com", hotel: "4 Star Hotel", hotelId: "H-003", room: "Superior Room", checkIn: "Apr 20, 2026", checkOut: "Apr 22, 2026", nights: 2, guests: 1, amount: "$520", paid: "$520", status: "Confirmed", booked: "Apr 16, 2026" },
  { id: "BK-1038", guest: "Raj Patel", email: "raj.p@email.com", hotel: "5 Star Hotel", hotelId: "H-007", room: "Rescue Room", checkIn: "Apr 19, 2026", checkOut: "Apr 23, 2026", nights: 4, guests: 3, amount: "$2,100", paid: "$2,100", status: "Checked Out", booked: "Apr 10, 2026" },
  { id: "BK-1037", guest: "Amelia Brown", email: "amelia.b@email.com", hotel: "Somerset Downtown", hotelId: "H-001", room: "Deluxe Suite", checkIn: "Apr 18, 2026", checkOut: "Apr 20, 2026", nights: 2, guests: 2, amount: "$620", paid: "$310", status: "Cancelled", booked: "Apr 12, 2026" },
  { id: "BK-1036", guest: "Lucas Smith", email: "l.smith@email.com", hotel: "3 Star Hotel", hotelId: "H-005", room: "Mansion Room", checkIn: "Apr 17, 2026", checkOut: "Apr 19, 2026", nights: 2, guests: 1, amount: "$340", paid: "$340", status: "Checked Out", booked: "Apr 14, 2026" },
  { id: "BK-1035", guest: "Priya Sharma", email: "priya.s@email.com", hotel: "Royal Heritage Hotel", hotelId: "H-007", room: "Royal Suite", checkIn: "Apr 25, 2026", checkOut: "Apr 29, 2026", nights: 4, guests: 2, amount: "$7,200", paid: "$7,200", status: "Confirmed", booked: "Apr 19, 2026" },
  { id: "BK-1034", guest: "Thomas Müller", email: "t.muller@email.com", hotel: "Mountain View Resort", hotelId: "H-004", room: "Garden Villa", checkIn: "May 1, 2026", checkOut: "May 5, 2026", nights: 4, guests: 4, amount: "$3,400", paid: "$1,700", status: "Pending", booked: "Apr 20, 2026" },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  "Checked In": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  "Checked Out": "bg-dark-muted/20 text-dark-muted border border-dark-border",
  Cancelled: "bg-red-500/15 text-red-400 border border-red-500/20",
  Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

const FILTERS = ["All", "Confirmed", "Checked In", "Checked Out", "Cancelled", "Pending"];

const emptyForm = {
  guest: "", email: "", hotelId: HOTEL_OPTIONS[0].id, room: ROOM_OPTIONS[0],
  checkIn: "", checkOut: "", guests: "1", amount: "", status: "Confirmed",
};
type BookingForm = typeof emptyForm;
type FormErrors = Partial<Record<keyof BookingForm, string>>;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Booking | null>(null);
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const filtered = bookings.filter((b) => {
    const matchesFilter = activeFilter === "All" || b.status === activeFilter;
    const q = search.toLowerCase();
    return matchesFilter && (!q || b.guest.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  });

  function openAdd() { setForm(emptyForm); setErrors({}); setApiError(""); setModalMode("add"); }
  function openEdit(b: Booking) {
    setForm({ guest: b.guest, email: b.email, hotelId: b.hotelId, room: b.room, checkIn: "", checkOut: "", guests: String(b.guests), amount: b.amount, status: b.status });
    setErrors({}); setApiError(""); setEditTarget(b); setModalMode("edit");
  }
  function closeModal() { setModalMode(null); setEditTarget(null); setApiError(""); }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.guest.trim()) e.guest = "Guest name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.checkIn) e.checkIn = "Check-in date is required";
    if (!form.checkOut) e.checkOut = "Check-out date is required";
    if (!form.amount.trim()) e.amount = "Amount is required";
    return e;
  }

  function formatDate(iso: string) {
    if (!iso) return "";
    try { return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
    catch { return iso; }
  }

  function nightsBetween(start: string, end: string) {
    if (!start || !end) return 0;
    return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError("");

    const hotel = HOTEL_OPTIONS.find((h) => h.id === form.hotelId)!;
    const amountNum = parseFloat(form.amount.replace(/[$,]/g, "")) || 0;
    const today = formatDate(new Date().toISOString().slice(0, 10));

    if (modalMode === "add") {
      try {
        // POST /api/v1/bookings/initiate
        const res = await api.initiateBooking({
          guestName: form.guest.trim(),
          guestEmail: form.email.trim(),
          hotelId: form.hotelId,
          roomType: form.room,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: Number(form.guests),
          totalAmount: amountNum,
          currency: "USD",
        });

        const nb: Booking = {
          id: res.bookingId,
          guest: form.guest.trim(),
          email: form.email.trim(),
          hotel: hotel.name,
          hotelId: form.hotelId,
          room: form.room,
          checkIn: formatDate(form.checkIn),
          checkOut: formatDate(form.checkOut),
          nights: nightsBetween(form.checkIn, form.checkOut),
          guests: Number(form.guests),
          amount: form.amount.trim(),
          paid: "$0",
          status: res.status === "confirmed" ? "Confirmed" : "Pending",
          booked: today,
        };
        setBookings((prev) => [nb, ...prev]);
      } catch {
        // API unavailable — create locally
        const nb: Booking = {
          id: `BK-${1041 + bookings.length + 1}`,
          guest: form.guest.trim(), email: form.email.trim(),
          hotel: hotel.name, hotelId: form.hotelId, room: form.room,
          checkIn: formatDate(form.checkIn), checkOut: formatDate(form.checkOut),
          nights: nightsBetween(form.checkIn, form.checkOut),
          guests: Number(form.guests), amount: form.amount.trim(),
          paid: "$0", status: form.status, booked: today,
        };
        setBookings((prev) => [nb, ...prev]);
      }
    } else if (editTarget) {
      setBookings((prev) => prev.map((b) =>
        b.id === editTarget.id
          ? { ...b, guest: form.guest.trim(), email: form.email.trim(), hotel: hotel.name, hotelId: form.hotelId, room: form.room, guests: Number(form.guests), amount: form.amount.trim(), status: form.status }
          : b
      ));
    }

    setSubmitting(false);
    closeModal();
  }

  function field(key: keyof BookingForm, value: string) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  }

  const inputCls = (err?: string) =>
    `w-full bg-dark border rounded-lg px-3 py-2 text-sm text-foreground placeholder-dark-muted focus:outline-none transition-colors ${err ? "border-red-500/60 focus:border-red-500" : "border-dark-border focus:border-gold"}`;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length.toString(), color: "text-foreground" },
          { label: "Confirmed", value: bookings.filter((b) => b.status === "Confirmed").length.toString(), color: "text-blue-400" },
          { label: "Checked In", value: bookings.filter((b) => b.status === "Checked In").length.toString(), color: "text-emerald-400" },
          { label: "Checked Out", value: bookings.filter((b) => b.status === "Checked Out").length.toString(), color: "text-dark-muted" },
          { label: "Cancelled", value: bookings.filter((b) => b.status === "Cancelled").length.toString(), color: "text-red-400" },
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
            {FILTERS.map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${f === activeFilter ? "bg-[#D8A95B] text-white" : "bg-dark border border-dark-border text-dark-muted hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-dark border border-dark-border rounded-lg text-xs text-foreground placeholder-dark-muted focus:outline-none focus:border-gold w-44" />
            </div>
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D8A95B] hover:bg-[#D8A95B] text-white text-xs font-semibold rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Booking
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
              {filtered.map((b, i) => (
                <tr key={b.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-4 text-gold text-xs font-mono">{b.id}</td>
                  <td className="px-5 py-4">
                    <p className="text-foreground text-xs font-medium">{b.guest}</p>
                    <p className="text-dark-muted text-[10px]">{b.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-foreground text-xs">{b.hotel}</p>
                    <p className="text-dark-muted text-[10px]">{b.room}</p>
                  </td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{b.checkIn}</td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{b.checkOut}</td>
                  <td className="px-5 py-4 text-foreground text-xs text-center">{b.nights}</td>
                  <td className="px-5 py-4">
                    <p className="text-foreground text-xs font-semibold">{b.amount}</p>
                    <p className="text-dark-muted text-[10px]">Paid: {b.paid}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => openEdit(b)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 hover:border-blue-400/40 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-dark-muted text-xs">Showing {filtered.length} of {bookings.length}</span>
          <span className="text-dark-muted text-[10px]">New bookings via POST /api/v1/bookings/initiate</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modalMode === "add" || modalMode === "edit"} onClose={closeModal}
        title={modalMode === "add" ? "Create New Booking" : "Edit Booking"} size="lg"
        footer={
          <>
            <button onClick={closeModal} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-foreground rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={submitting}
              className="px-4 py-2 bg-[#D8A95B] hover:bg-[#D8A95B] disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
              {submitting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Initiating…
                </>
              ) : modalMode === "add" ? "Initiate Booking" : "Save Changes"}
            </button>
          </>
        }
      >
        {apiError && (
          <div className="mb-4 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">{apiError}</div>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Guest Name *</label>
              <input value={form.guest} onChange={(e) => field("guest", e.target.value)} placeholder="Full name" className={inputCls(errors.guest)} />
              {errors.guest && <p className="text-red-400 text-xs mt-1">{errors.guest}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => field("email", e.target.value)} placeholder="guest@email.com" className={inputCls(errors.email)} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Hotel</label>
              <select value={form.hotelId} onChange={(e) => field("hotelId", e.target.value)} className={inputCls()}>
                {HOTEL_OPTIONS.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Room</label>
              <select value={form.room} onChange={(e) => field("room", e.target.value)} className={inputCls()}>
                {ROOM_OPTIONS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Check-in Date *</label>
              <input type="date" value={form.checkIn} onChange={(e) => field("checkIn", e.target.value)} className={inputCls(errors.checkIn)} />
              {errors.checkIn && <p className="text-red-400 text-xs mt-1">{errors.checkIn}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Check-out Date *</label>
              <input type="date" value={form.checkOut} onChange={(e) => field("checkOut", e.target.value)} className={inputCls(errors.checkOut)} />
              {errors.checkOut && <p className="text-red-400 text-xs mt-1">{errors.checkOut}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Number of Guests</label>
              <input type="number" min={1} max={10} value={form.guests} onChange={(e) => field("guests", e.target.value)} className={inputCls()} />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Total Amount *</label>
              <input value={form.amount} onChange={(e) => field("amount", e.target.value)} placeholder="e.g. $1,200" className={inputCls(errors.amount)} />
              {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => field("status", e.target.value)} className={inputCls()}>
                {FILTERS.filter((f) => f !== "All").map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {modalMode === "add" && (
            <p className="text-dark-muted text-xs border border-dark-border rounded-lg px-3 py-2">
              Submitting will call <span className="font-mono text-gold">POST /api/v1/bookings/initiate</span> to create a booking session.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
