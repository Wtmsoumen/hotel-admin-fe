"use client";

import { useState } from "react";

interface Toggle {
  label: string;
  checked: boolean;
}

interface Notification {
  label: string;
  sub: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [general, setGeneral] = useState({
    platformName: "Hotel Booking",
    supportEmail: "info@hotelbooking.com",
    phone: "+01 234 567 890",
    currency: "USD ($)",
    address: "123 Seaside Retreat Lane, Palm Cove, FL 33140, United States",
  });

  const [booking, setBooking] = useState({
    minStay: 1,
    maxAdvance: 365,
    checkInTime: "14:00",
    checkOutTime: "11:00",
  });

  const [bookingToggles, setBookingToggles] = useState<Toggle[]>([
    { label: "Allow same-day bookings", checked: true },
    { label: "Require payment upfront", checked: true },
    { label: "Send booking confirmation emails", checked: true },
    { label: "Enable instant booking", checked: false },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { label: "New booking notifications", sub: "Alert when a new booking is made", enabled: true },
    { label: "Cancellation alerts", sub: "Alert when a booking is cancelled", enabled: true },
    { label: "New review notifications", sub: "Alert when a new review is submitted", enabled: true },
    { label: "New message alerts", sub: "Alert when a contact form message arrives", enabled: true },
    { label: "Low occupancy warnings", sub: "Alert when occupancy drops below 20%", enabled: false },
    { label: "Revenue reports", sub: "Weekly revenue summary emails", enabled: false },
  ]);

  const [saved, setSaved] = useState(false);

  function toggleBookingOption(index: number) {
    setBookingToggles((prev) =>
      prev.map((t, i) => (i === index ? { ...t, checked: !t.checked } : t))
    );
  }

  function toggleNotification(index: number) {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setGeneral({
      platformName: "Hotel Booking",
      supportEmail: "info@hotelbooking.com",
      phone: "+01 234 567 890",
      currency: "USD ($)",
      address: "123 Seaside Retreat Lane, Palm Cove, FL 33140, United States",
    });
    setBooking({ minStay: 1, maxAdvance: 365, checkInTime: "14:00", checkOutTime: "11:00" });
    setBookingToggles([
      { label: "Allow same-day bookings", checked: true },
      { label: "Require payment upfront", checked: true },
      { label: "Send booking confirmation emails", checked: true },
      { label: "Enable instant booking", checked: false },
    ]);
    setNotifications([
      { label: "New booking notifications", sub: "Alert when a new booking is made", enabled: true },
      { label: "Cancellation alerts", sub: "Alert when a booking is cancelled", enabled: true },
      { label: "New review notifications", sub: "Alert when a new review is submitted", enabled: true },
      { label: "New message alerts", sub: "Alert when a contact form message arrives", enabled: true },
      { label: "Low occupancy warnings", sub: "Alert when occupancy drops below 20%", enabled: false },
      { label: "Revenue reports", sub: "Weekly revenue summary emails", enabled: false },
    ]);
  }

  const inputCls = "w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Success Banner */}
      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully.
        </div>
      )}

      {/* General */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <h2 className="text-white font-semibold">General Settings</h2>
          <p className="text-dark-muted text-xs mt-0.5">Basic platform configuration</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Platform Name</label>
              <input
                value={general.platformName}
                onChange={(e) => setGeneral((g) => ({ ...g, platformName: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Support Email</label>
              <input
                type="email"
                value={general.supportEmail}
                onChange={(e) => setGeneral((g) => ({ ...g, supportEmail: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Primary Phone</label>
              <input
                value={general.phone}
                onChange={(e) => setGeneral((g) => ({ ...g, phone: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Currency</label>
              <select
                value={general.currency}
                onChange={(e) => setGeneral((g) => ({ ...g, currency: e.target.value }))}
                className={inputCls}
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-dark-muted text-xs font-medium mb-1.5">Office Address</label>
            <textarea
              rows={2}
              value={general.address}
              onChange={(e) => setGeneral((g) => ({ ...g, address: e.target.value }))}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <h2 className="text-white font-semibold">Booking Settings</h2>
          <p className="text-dark-muted text-xs mt-0.5">Configure booking rules and policies</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Minimum Stay (nights)</label>
              <input
                type="number"
                min={1}
                value={booking.minStay}
                onChange={(e) => setBooking((b) => ({ ...b, minStay: Number(e.target.value) }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Maximum Advance Booking (days)</label>
              <input
                type="number"
                min={1}
                value={booking.maxAdvance}
                onChange={(e) => setBooking((b) => ({ ...b, maxAdvance: Number(e.target.value) }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Check-in Time</label>
              <input
                type="time"
                value={booking.checkInTime}
                onChange={(e) => setBooking((b) => ({ ...b, checkInTime: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Check-out Time</label>
              <input
                type="time"
                value={booking.checkOutTime}
                onChange={(e) => setBooking((b) => ({ ...b, checkOutTime: e.target.value }))}
                className={inputCls}
              />
            </div>
          </div>
          <div className="space-y-3">
            {bookingToggles.map((toggle, i) => (
              <div key={toggle.label} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                <span className="text-white text-sm">{toggle.label}</span>
                <button
                  onClick={() => toggleBookingOption(i)}
                  className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${toggle.checked ? "bg-gold" : "bg-dark border border-dark-border"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${toggle.checked ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-border">
          <h2 className="text-white font-semibold">Notifications</h2>
          <p className="text-dark-muted text-xs mt-0.5">Configure alert preferences</p>
        </div>
        <div className="p-5 space-y-2">
          {notifications.map((n, i) => (
            <div key={n.label} className="flex items-center justify-between py-3 border-b border-dark-border/40 last:border-0">
              <div>
                <p className="text-white text-sm">{n.label}</p>
                <p className="text-dark-muted text-xs">{n.sub}</p>
              </div>
              <button
                onClick={() => toggleNotification(i)}
                className={`relative w-10 shrink-0 rounded-full transition-colors h-5 ${n.enabled ? "bg-gold" : "bg-dark border border-dark-border"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${n.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button onClick={handleReset} className="px-5 py-2 bg-dark-card border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm font-medium transition-colors">
          Reset to Defaults
        </button>
        <button onClick={handleSave} className="px-5 py-2 bg-gold hover:bg-gold-light text-dark rounded-lg text-sm font-semibold transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
