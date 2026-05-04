const messages = [
  { id: "MSG-041", name: "James Carter", email: "james.c@email.com", phone: "+1 (555) 0147", subject: "Booking inquiry for corporate retreat", message: "Hi, I am planning a corporate retreat for 50 employees in September. Could you provide information on group booking rates and available facilities for team events? We are looking at a 3-night stay.", date: "Apr 20, 2026", time: "09:14 AM", status: "Unread", priority: "High" },
  { id: "MSG-040", name: "Sophie Laurent", email: "sophie.l@email.com", phone: "+33 6 12 34 56 78", subject: "Honeymoon package request", message: "We are celebrating our honeymoon in October and are interested in your romantic package for Bali. Could you share details about room upgrades and special arrangements?", date: "Apr 20, 2026", time: "08:45 AM", status: "Replied", priority: "Medium" },
  { id: "MSG-039", name: "David Kim", email: "d.kim@email.com", phone: "+82 10 1234 5678", subject: "Cancellation policy question", message: "I have a booking for next month and unfortunately need to cancel due to a family emergency. What is the refund policy for bookings cancelled 3 weeks in advance?", date: "Apr 19, 2026", time: "11:22 PM", status: "Replied", priority: "Medium" },
  { id: "MSG-038", name: "Fatima Al-Hassan", email: "fatima.h@email.com", phone: "+971 50 123 4567", subject: "Accessibility requirements", message: "I will be travelling with my elderly mother who uses a wheelchair. Could you confirm if your Somerset Downtown property has accessible rooms and facilities including ramps and roll-in showers?", date: "Apr 19, 2026", time: "04:30 PM", status: "Unread", priority: "High" },
  { id: "MSG-037", name: "Carlos Rodriguez", email: "c.rod@email.com", phone: "+34 612 345 678", subject: "Early check-in request", message: "My flight arrives at 7 AM and I would like to check in early if possible. Is an early check-in available for my booking BK-1033? Happy to pay any associated fee.", date: "Apr 18, 2026", time: "03:15 PM", status: "Replied", priority: "Low" },
  { id: "MSG-036", name: "Ananya Gupta", email: "ananya.g@email.com", phone: "+91 98123 45678", subject: "Feedback on recent stay", message: "I recently stayed at your Goa property and wanted to share some feedback. Overall the experience was wonderful but there were a few areas for improvement that I would like to discuss.", date: "Apr 18, 2026", time: "10:08 AM", status: "Unread", priority: "Medium" },
  { id: "MSG-035", name: "Lars Andersen", email: "lars.a@email.com", phone: "+45 20 12 34 56", subject: "Lost item report", message: "I left my laptop charger in room 304 during my stay last week. Could you check with housekeeping and let me know if it was found? I am willing to arrange a courier pickup.", date: "Apr 17, 2026", time: "06:42 PM", status: "Resolved", priority: "Low" },
];

const statusStyles: Record<string, string> = {
  Unread: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  Replied: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Resolved: "bg-dark-muted/20 text-dark-muted border border-dark-border",
};

const priorityStyles: Record<string, string> = {
  High: "text-red-400",
  Medium: "text-amber-400",
  Low: "text-dark-muted",
};

export default function MessagesPage() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Messages", value: "284", icon: "📬" },
          { label: "Unread", value: "23", icon: "🔵" },
          { label: "Replied", value: "241", icon: "✅" },
          { label: "Avg Response", value: "2.4h", icon: "⚡" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-white font-bold text-lg">{s.value}</p>
              <p className="text-dark-muted text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Message list */}
        <div className="xl:col-span-1 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Inbox</h2>
            <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">23 unread</span>
          </div>
          <div className="divide-y divide-dark-border/50 overflow-y-auto max-h-[500px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`px-4 py-3.5 cursor-pointer transition-colors hover:bg-dark-hover/50 ${m.status === "Unread" ? "border-l-2 border-gold" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-gold text-[10px] font-bold">{m.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${m.status === "Unread" ? "text-white" : "text-dark-muted"}`}>{m.name}</p>
                      <p className="text-dark-muted text-[10px] truncate max-w-[140px]">{m.subject}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-dark-muted text-[10px]">{m.time}</p>
                    {m.status === "Unread" && <div className="w-1.5 h-1.5 rounded-full bg-gold ml-auto mt-1" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="xl:col-span-2 bg-dark-card border border-dark-border rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-dark-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/20 flex items-center justify-center shrink-0">
                  <span className="text-gold text-sm font-bold">JC</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">James Carter</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles["Unread"]}`}>Unread</span>
                    <span className={`text-[10px] font-semibold ${priorityStyles["High"]}`}>● High Priority</span>
                  </div>
                  <p className="text-dark-muted text-xs">james.c@email.com • +1 (555) 0147</p>
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </button>
                <button className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-3 pl-13">
              <p className="text-dark-muted text-[10px]">Apr 20, 2026 at 09:14 AM • MSG-041</p>
            </div>
          </div>

          {/* Subject & Message */}
          <div className="p-5 flex-1">
            <h3 className="text-white font-semibold text-base mb-4">Booking inquiry for corporate retreat</h3>
            <div className="bg-dark rounded-xl border border-dark-border p-4">
              <p className="text-dark-muted text-sm leading-relaxed">
                Hi, I am planning a corporate retreat for 50 employees in September. Could you provide information on group booking rates and available facilities for team events? We are looking at a 3-night stay.
              </p>
              <p className="text-dark-muted text-sm leading-relaxed mt-3">
                Ideally we would need a conference room, catering services, and accommodation for all attendees. Please let me know what options are available and any bulk pricing you may offer.
              </p>
            </div>
          </div>

          {/* Reply */}
          <div className="px-5 pb-5">
            <div className="border border-dark-border rounded-xl overflow-hidden focus-within:border-gold transition-colors">
              <textarea
                rows={3}
                placeholder="Write your reply..."
                className="w-full bg-dark px-4 pt-3 text-sm text-white placeholder-dark-muted focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between px-4 py-2.5 bg-dark border-t border-dark-border">
                <div className="flex gap-2">
                  <button className="p-1.5 text-dark-muted hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-1.5 bg-gold hover:bg-gold-light text-dark text-xs font-semibold rounded-lg transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
