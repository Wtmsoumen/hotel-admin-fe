export default function SettingsPage() {
  return (
    <div className="space-y-5 max-w-4xl">
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
              <input defaultValue="Hotel Booking" className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Support Email</label>
              <input defaultValue="info@hotelbooking.com" className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Primary Phone</label>
              <input defaultValue="+01 234 567 890" className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Currency</label>
              <select className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-dark-muted text-xs font-medium mb-1.5">Office Address</label>
            <textarea rows={2} defaultValue="123 Seaside Retreat Lane, Palm Cove, FL 33140, United States" className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors resize-none" />
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
              <input type="number" defaultValue={1} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Maximum Advance Booking (days)</label>
              <input type="number" defaultValue={365} className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Check-in Time</label>
              <input type="time" defaultValue="14:00" className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Check-out Time</label>
              <input type="time" defaultValue="11:00" className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Allow same-day bookings", checked: true },
              { label: "Require payment upfront", checked: true },
              { label: "Send booking confirmation emails", checked: true },
              { label: "Enable instant booking", checked: false },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between py-2 border-b border-dark-border/50 last:border-0">
                <span className="text-white text-sm">{toggle.label}</span>
                <button
                  className={`relative w-10 h-5.5 rounded-full transition-colors ${toggle.checked ? "bg-gold" : "bg-dark border border-dark-border"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${toggle.checked ? "translate-x-5" : "translate-x-5"}`}
                  />
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
          {[
            { label: "New booking notifications", sub: "Alert when a new booking is made", enabled: true },
            { label: "Cancellation alerts", sub: "Alert when a booking is cancelled", enabled: true },
            { label: "New review notifications", sub: "Alert when a new review is submitted", enabled: true },
            { label: "New message alerts", sub: "Alert when a contact form message arrives", enabled: true },
            { label: "Low occupancy warnings", sub: "Alert when occupancy drops below 20%", enabled: false },
            { label: "Revenue reports", sub: "Weekly revenue summary emails", enabled: false },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between py-3 border-b border-dark-border/40 last:border-0">
              <div>
                <p className="text-white text-sm">{n.label}</p>
                <p className="text-dark-muted text-xs">{n.sub}</p>
              </div>
              <button
                className={`relative w-10 shrink-0 rounded-full transition-colors h-5 ${n.enabled ? "bg-gold" : "bg-dark border border-dark-border"}`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${n.enabled ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button className="px-5 py-2 bg-dark-card border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm font-medium transition-colors">
          Reset to Defaults
        </button>
        <button className="px-5 py-2 bg-gold hover:bg-gold-light text-dark rounded-lg text-sm font-semibold transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
