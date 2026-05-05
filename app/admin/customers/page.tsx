"use client";

import { useState } from "react";
import Modal from "@/app/components/Modal";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  joined: string;
  bookings: number;
  spent: string;
  status: string;
  tier: string;
}

const initialCustomers: Customer[] = [
  { id: "U-0021", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1 (555) 0142", country: "USA", joined: "Jan 12, 2025", bookings: 8, spent: "$4,820", status: "Active", tier: "Gold" },
  { id: "U-0020", name: "Michael Chen", email: "m.chen@email.com", phone: "+65 9123 4567", country: "Singapore", joined: "Mar 8, 2025", bookings: 5, spent: "$2,340", status: "Active", tier: "Silver" },
  { id: "U-0019", name: "Emma Wilson", email: "emma.w@email.com", phone: "+44 7700 900234", country: "UK", joined: "Nov 22, 2024", bookings: 12, spent: "$8,950", status: "Active", tier: "Platinum" },
  { id: "U-0018", name: "Raj Patel", email: "raj.p@email.com", phone: "+91 98765 43210", country: "India", joined: "Jul 5, 2024", bookings: 3, spent: "$1,100", status: "Active", tier: "Bronze" },
  { id: "U-0017", name: "Amelia Brown", email: "amelia.b@email.com", phone: "+61 412 345 678", country: "Australia", joined: "Feb 14, 2025", bookings: 6, spent: "$3,200", status: "Active", tier: "Silver" },
  { id: "U-0016", name: "Lucas Smith", email: "l.smith@email.com", phone: "+1 (555) 0198", country: "Canada", joined: "Dec 30, 2024", bookings: 2, spent: "$680", status: "Inactive", tier: "Bronze" },
  { id: "U-0015", name: "Priya Sharma", email: "priya.s@email.com", phone: "+91 87654 32109", country: "India", joined: "Sep 17, 2024", bookings: 18, spent: "$22,400", status: "Active", tier: "Platinum" },
  { id: "U-0014", name: "Thomas Müller", email: "t.muller@email.com", phone: "+49 151 23456789", country: "Germany", joined: "Apr 1, 2025", bookings: 1, spent: "$450", status: "Active", tier: "Bronze" },
];

const tierStyles: Record<string, string> = {
  Platinum: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  Gold: "bg-gold/10 text-gold border-gold/20",
  Silver: "bg-slate-400/10 text-slate-300 border-slate-400/20",
  Bronze: "bg-amber-700/10 text-amber-500 border-amber-700/20",
};

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  Inactive: "bg-red-500/15 text-red-400 border border-red-500/20",
};

const emptyForm = {
  name: "", email: "", phone: "", country: "", status: "Active", tier: "Bronze",
};

type CustomerForm = typeof emptyForm;
type FormErrors = Partial<Record<keyof CustomerForm, string>>;

const tiers = ["Platinum", "Gold", "Silver", "Bronze"];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchesTier = tierFilter === "All Tiers" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  function openAdd() { setForm(emptyForm); setErrors({}); setModalMode("add"); }

  function openEdit(c: Customer) {
    setForm({ name: c.name, email: c.email, phone: c.phone, country: c.country, status: c.status, tier: c.tier });
    setErrors({});
    setEditTarget(c);
    setModalMode("edit");
  }

  function closeModal() { setModalMode(null); setEditTarget(null); }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.country.trim()) e.country = "Country is required";
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    if (modalMode === "add") {
      const nc: Customer = {
        id: `U-${String(initialCustomers.length + customers.length).padStart(4, "0")}`,
        name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || "—",
        country: form.country.trim(), joined: today, bookings: 0, spent: "$0",
        status: form.status, tier: form.tier,
      };
      setCustomers((prev) => [nc, ...prev]);
    } else if (modalMode === "edit" && editTarget) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editTarget.id
            ? { ...c, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() || c.phone, country: form.country.trim(), status: form.status, tier: form.tier }
            : c
        )
      );
    }
    closeModal();
  }

  function handleToggleStatus() {
    if (!deactivateTarget) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === deactivateTarget.id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c
      )
    );
    setDeactivateTarget(null);
  }

  function field(key: keyof CustomerForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const inputCls = (err?: string) =>
    `w-full bg-dark border rounded-lg px-3 py-2 text-sm text-white placeholder-dark-muted focus:outline-none transition-colors ${
      err ? "border-red-500/60 focus:border-red-500" : "border-dark-border focus:border-gold"
    }`;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: customers.length.toString(), sub: "" },
          { label: "Active", value: customers.filter((c) => c.status === "Active").length.toString(), sub: "" },
          { label: "Platinum Members", value: customers.filter((c) => c.tier === "Platinum").length.toString(), sub: "Premium tier" },
          { label: "Tiers", value: "4", sub: "Platinum · Gold · Silver · Bronze" },
        ].map((s) => (
          <div key={s.label} className="bg-dark-card border border-dark-border rounded-xl p-4">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-dark-muted text-xs mt-0.5">{s.label}</p>
            {s.sub && <p className="text-emerald-400 text-[10px] mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-dark-border">
          <h2 className="text-white font-semibold">All Customers</h2>
          <div className="flex gap-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-dark border border-dark-border rounded-lg text-xs text-white placeholder-dark-muted focus:outline-none focus:border-gold w-44"
              />
            </div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-dark border border-dark-border text-dark-muted text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-gold"
            >
              <option>All Tiers</option>
              {tiers.map((t) => <option key={t}>{t}</option>)}
            </select>
            <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-gold hover:bg-gold-light text-dark text-xs font-semibold rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Customer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                {["Customer", "Contact", "Country", "Joined", "Bookings", "Total Spent", "Tier", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-dark-muted text-xs font-medium px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-dark-border/50 hover:bg-dark-hover/50 transition-colors ${i === filtered.length - 1 ? "border-0" : ""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-gold text-xs font-bold">{c.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">{c.name}</p>
                        <p className="text-dark-muted text-[10px] font-mono">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white text-xs">{c.email}</p>
                    <p className="text-dark-muted text-[10px]">{c.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-dark-muted text-xs">{c.country}</td>
                  <td className="px-5 py-4 text-dark-muted text-xs whitespace-nowrap">{c.joined}</td>
                  <td className="px-5 py-4 text-white text-xs font-medium text-center">{c.bookings}</td>
                  <td className="px-5 py-4 text-gold text-xs font-semibold">{c.spent}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tierStyles[c.tier]}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-blue-400 hover:border-blue-400/40 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => setDeactivateTarget(c)} className="p-1.5 rounded-md bg-dark border border-dark-border text-dark-muted hover:text-red-400 hover:border-red-400/40 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-dark-border flex items-center justify-between">
          <span className="text-dark-muted text-xs">Showing {filtered.length} of {customers.length}</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalMode === "add" || modalMode === "edit"}
        onClose={closeModal}
        title={modalMode === "add" ? "Add New Customer" : "Edit Customer"}
        size="md"
        footer={
          <>
            <button onClick={closeModal} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-gold hover:bg-gold-light text-dark font-semibold rounded-lg text-sm transition-colors">
              {modalMode === "add" ? "Add Customer" : "Save Changes"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Full Name *</label>
              <input value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Jane Doe" className={inputCls(errors.name)} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => field("email", e.target.value)} placeholder="jane@example.com" className={inputCls(errors.email)} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => field("phone", e.target.value)} placeholder="+1 555 000 0000" className={inputCls()} />
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Country *</label>
              <input value={form.country} onChange={(e) => field("country", e.target.value)} placeholder="e.g. USA" className={inputCls(errors.country)} />
              {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
            </div>
            <div>
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Membership Tier</label>
              <select value={form.tier} onChange={(e) => field("tier", e.target.value)} className={inputCls()}>
                {tiers.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-dark-muted text-xs font-medium mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => field("status", e.target.value)} className={inputCls()}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Deactivate / Reactivate Confirmation */}
      <Modal
        open={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title={deactivateTarget?.status === "Active" ? "Deactivate Customer" : "Reactivate Customer"}
        size="sm"
        footer={
          <>
            <button onClick={() => setDeactivateTarget(null)} className="px-4 py-2 bg-dark border border-dark-border text-dark-muted hover:text-white rounded-lg text-sm transition-colors">Cancel</button>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 font-semibold rounded-lg text-sm transition-colors ${deactivateTarget?.status === "Active" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"}`}
            >
              {deactivateTarget?.status === "Active" ? "Deactivate" : "Reactivate"}
            </button>
          </>
        }
      >
        <p className="text-dark-muted text-sm">
          {deactivateTarget?.status === "Active"
            ? <>Are you sure you want to deactivate <span className="text-white font-medium">{deactivateTarget?.name}</span>? They won&apos;t be able to make new bookings.</>
            : <>Reactivate <span className="text-white font-medium">{deactivateTarget?.name}</span>? They will regain access to the platform.</>}
        </p>
      </Modal>
    </div>
  );
}
