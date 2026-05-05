"use client";

import { useState } from "react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  time: string;
  status: string;
  priority: string;
}

const initialMessages: Message[] = [
  { id: "MSG-041", name: "James Carter", email: "james.c@email.com", phone: "+1 (555) 0147", subject: "Booking inquiry for corporate retreat", message: "Hi, I am planning a corporate retreat for 50 employees in September. Could you provide information on group booking rates and available facilities for team events? We are looking at a 3-night stay.\n\nIdeally we would need a conference room, catering services, and accommodation for all attendees. Please let me know what options are available and any bulk pricing you may offer.", date: "Apr 20, 2026", time: "09:14 AM", status: "Unread", priority: "High" },
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
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selected, setSelected] = useState<Message>(initialMessages[0]);
  const [reply, setReply] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [replyError, setReplyError] = useState("");

  function selectMessage(m: Message) {
    setSelected(m);
    setReply("");
    setReplySent(false);
    setReplyError("");
    if (m.status === "Unread") {
      setMessages((prev) => prev.map((msg) => msg.id === m.id ? { ...msg, status: "Replied" } : msg));
    }
  }

  function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) { setReplyError("Reply cannot be empty."); return; }
    setReplyError("");
    setMessages((prev) =>
      prev.map((m) => m.id === selected.id ? { ...m, status: "Replied" } : m)
    );
    setSelected((prev) => ({ ...prev, status: "Replied" }));
    setReply("");
    setReplySent(true);
    setTimeout(() => setReplySent(false), 3000);
  }

  function handleMarkResolved() {
    setMessages((prev) => prev.map((m) => m.id === selected.id ? { ...m, status: "Resolved" } : m));
    setSelected((prev) => ({ ...prev, status: "Resolved" }));
  }

  function handleDelete() {
    const remaining = messages.filter((m) => m.id !== selected.id);
    setMessages(remaining);
    if (remaining.length > 0) setSelected(remaining[0]);
  }

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Messages", value: messages.length.toString(), icon: "📬" },
          { label: "Unread", value: unreadCount.toString(), icon: "🔵" },
          { label: "Replied", value: messages.filter((m) => m.status === "Replied").length.toString(), icon: "✅" },
          { label: "Resolved", value: messages.filter((m) => m.status === "Resolved").length.toString(), icon: "⚡" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-foreground font-bold text-lg">{s.value}</p>
              <p className="text-dark-muted text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Message list */}
        <div className="xl:col-span-1 bg-dark-card border border-dark-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-dark-border flex items-center justify-between">
            <h2 className="text-foreground font-semibold text-sm">Inbox</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">{unreadCount} unread</span>
            )}
          </div>
          <div className="divide-y divide-dark-border/50 overflow-y-auto max-h-[500px]">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => selectMessage(m)}
                className={`px-4 py-3.5 cursor-pointer transition-colors hover:bg-dark-hover/50 ${m.status === "Unread" ? "border-l-2 border-gold" : ""} ${selected.id === m.id ? "bg-dark-hover/40" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#D8A95B]/20 border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-gold text-[10px] font-bold">{m.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${m.status === "Unread" ? "text-foreground" : "text-dark-muted"}`}>{m.name}</p>
                      <p className="text-dark-muted text-[10px] truncate max-w-[140px]">{m.subject}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-dark-muted text-[10px]">{m.time}</p>
                    {m.status === "Unread" && <div className="w-1.5 h-1.5 rounded-full bg-[#D8A95B] ml-auto mt-1" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="xl:col-span-2 bg-dark-card border border-dark-border rounded-xl overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-10 text-dark-muted text-sm">No messages</div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-dark-border">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D8A95B]/20 border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-gold text-sm font-bold">{selected.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-foreground font-semibold text-sm">{selected.name}</p>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[selected.status]}`}>{selected.status}</span>
                        <span className={`text-[10px] font-semibold ${priorityStyles[selected.priority]}`}>● {selected.priority} Priority</span>
                      </div>
                      <p className="text-dark-muted text-xs">{selected.email} • {selected.phone}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {selected.status !== "Resolved" && (
                      <button onClick={handleMarkResolved} className="px-2.5 py-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-emerald-400 hover:border-emerald-400/40 transition-colors text-xs">
                        Resolve
                      </button>
                    )}
                    <button onClick={handleDelete} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-dark-muted text-[10px]">{selected.date} at {selected.time} • {selected.id}</p>
                </div>
              </div>

              {/* Subject & Message */}
              <div className="p-5 flex-1">
                <h3 className="text-foreground font-semibold text-base mb-4">{selected.subject}</h3>
                <div className="bg-dark rounded-xl border border-dark-border p-4">
                  {selected.message.split("\n\n").map((para, i) => (
                    <p key={i} className={`text-dark-muted text-sm leading-relaxed ${i > 0 ? "mt-3" : ""}`}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <div className="px-5 pb-5">
                {replySent && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Reply sent successfully.
                  </div>
                )}
                <form onSubmit={handleSendReply} noValidate>
                  <div className={`border rounded-xl overflow-hidden transition-colors ${replyError ? "border-red-500/60" : "border-dark-border focus-within:border-gold"}`}>
                    <textarea
                      rows={3}
                      value={reply}
                      onChange={(e) => { setReply(e.target.value); if (replyError) setReplyError(""); }}
                      placeholder="Write your reply..."
                      className="w-full bg-dark px-4 pt-3 text-sm text-foreground placeholder-dark-muted focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-between px-4 py-2.5 bg-dark border-t border-dark-border">
                      <span className="text-dark-muted text-xs">
                        Replying to <span className="text-foreground">{selected.email}</span>
                      </span>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-1.5 bg-[#D8A95B] hover:bg-[#D8A95B] text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Reply
                      </button>
                    </div>
                  </div>
                  {replyError && <p className="text-red-400 text-xs mt-1">{replyError}</p>}
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
