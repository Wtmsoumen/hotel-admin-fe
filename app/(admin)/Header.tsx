"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome back, Admin" },
  "/hotels": { title: "Hotels", subtitle: "Manage hotel listings" },
  "/rooms": { title: "Rooms", subtitle: "Manage room inventory" },
  "/bookings": { title: "Bookings", subtitle: "Track reservations" },
  "/customers": { title: "Customers", subtitle: "Manage registered users" },
  "/destinations": { title: "Destinations", subtitle: "Manage travel destinations" },
  "/packages": { title: "Packages", subtitle: "Manage travel packages" },
  "/reviews": { title: "Reviews", subtitle: "Monitor customer feedback" },
  "/messages": { title: "Messages", subtitle: "Contact form submissions" },
  "/settings": { title: "Settings", subtitle: "Configure platform settings" },
};

export default function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: "Admin", subtitle: "" };

  return (
    <header className="h-16 shrink-0 border-b border-dark-border bg-dark-card flex items-center px-6 gap-4">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-foreground font-semibold text-base leading-tight">{page.title}</h1>
        <p className="text-dark-muted text-xs mt-0.5">{page.subtitle}</p>
      </div>

      {/* Search */}
      <div className="relative hidden sm:block">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="pl-9 pr-4 py-2 bg-dark border border-dark-border rounded-lg text-sm text-foreground placeholder-dark-muted focus:outline-none focus:border-gold transition-colors w-52"
        />
      </div>

      {/* Notification bell */}
      <button className="relative p-2 rounded-lg bg-dark border border-dark-border hover:border-gold/50 transition-colors">
        <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D8A95B] rounded-full" />
      </button>

    </header>
  );
}
