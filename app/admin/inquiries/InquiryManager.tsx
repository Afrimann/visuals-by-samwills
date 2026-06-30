"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  projectType: string | null;
  message: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date | string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  NEW: { label: "New", className: "text-gold bg-gold/10 border-gold/30" },
  READ: { label: "Read", className: "text-blue-400 bg-blue-400/10 border-blue-400/30" },
  REPLIED: { label: "Replied", className: "text-green-400 bg-green-400/10 border-green-400/30" },
  ARCHIVED: { label: "Archived", className: "text-smoke bg-smoke/10 border-smoke/30" },
};

const FILTERS = ["ALL", "NEW", "READ", "REPLIED", "ARCHIVED"] as const;

async function fetchSubmissions(): Promise<Submission[]> {
  const res = await fetch("/api/contact");
  if (!res.ok) throw new Error("Failed to fetch inquiries");
  return res.json();
}

export default function InquiryManager({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const queryClient = useQueryClient();

  const { data: submissions = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: fetchSubmissions,
    initialData: initialSubmissions,
    initialDataUpdatedAt: Date.now(),
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
  }

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => invalidate(),
  });

  const notesMutation = useMutation({
    mutationFn: async ({ id, adminNotes }: { id: string; adminNotes: string }) => {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      return res.json();
    },
    onSuccess: () => invalidate(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: (_, id) => {
      if (expandedId === id) setExpandedId(null);
      invalidate();
    },
  });

  const filtered = filter === "ALL" ? submissions : submissions.filter((s) => s.status === filter);

  function countFor(f: (typeof FILTERS)[number]) {
    return f === "ALL" ? submissions.length : submissions.filter((s) => s.status === f).length;
  }

  function toggleExpand(sub: Submission) {
    if (expandedId === sub.id) { setExpandedId(null); return; }
    setExpandedId(sub.id);
    setNotes((prev) => ({ ...prev, [sub.id]: sub.adminNotes ?? "" }));
    if (sub.status === "NEW") statusMutation.mutate({ id: sub.id, status: "READ" });
  }

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs tracking-widest uppercase font-[family-name:var(--font-accent)] rounded transition-colors ${
              filter === f ? "bg-gold/10 text-gold" : "text-silver hover:text-off-white"
            }`}
          >
            {f === "ALL" ? "All" : STATUS_CONFIG[f].label}
            <span className="ml-1.5 opacity-60">({countFor(f)})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-charcoal border border-smoke/40 rounded-sm py-14 text-center">
          <p className="text-silver text-sm font-[family-name:var(--font-body)]">No inquiries yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((sub) => {
            const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.NEW;
            const isOpen = expandedId === sub.id;

            return (
              <div
                key={sub.id}
                className={`bg-charcoal border rounded-sm transition-colors ${
                  isOpen ? "border-gold/30" : "border-smoke/40 hover:border-smoke/70"
                }`}
              >
                <button
                  onClick={() => toggleExpand(sub)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4"
                >
                  <span
                    className={`mt-1 shrink-0 w-2 h-2 rounded-full ${
                      sub.status === "NEW" ? "bg-gold" : sub.status === "REPLIED" ? "bg-green-400" : "bg-smoke"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-0.5">
                      <span className="text-off-white text-sm font-[family-name:var(--font-body)] font-medium">
                        {sub.name}
                      </span>
                      <span className="text-smoke text-xs">{sub.email}</span>
                      {sub.projectType && (
                        <span className="text-xs text-silver border border-smoke/40 rounded px-1.5 py-0.5 font-[family-name:var(--font-accent)] tracking-wide">
                          {sub.projectType}
                        </span>
                      )}
                    </div>
                    <p className="text-silver text-xs line-clamp-1 font-[family-name:var(--font-body)]">
                      {sub.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full border font-[family-name:var(--font-accent)] ${cfg.className}`}>
                      {cfg.label}
                    </span>
                    <span className="text-smoke text-xs font-[family-name:var(--font-body)] hidden sm:block">
                      {formatDate(sub.createdAt)}
                    </span>
                    <span className={`text-smoke text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-smoke/40 px-5 pb-5 pt-4">
                    <div className="flex flex-wrap gap-4 mb-5 text-xs font-[family-name:var(--font-body)]">
                      <div>
                        <span className="text-smoke uppercase tracking-widest font-[family-name:var(--font-accent)]">Email</span>
                        <a href={`mailto:${sub.email}`} className="block text-gold hover:underline mt-0.5">
                          {sub.email}
                        </a>
                      </div>
                      {sub.phone && (
                        <div>
                          <span className="text-smoke uppercase tracking-widest font-[family-name:var(--font-accent)]">Phone</span>
                          <a href={`tel:${sub.phone}`} className="block text-off-white hover:text-gold mt-0.5">
                            {sub.phone}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="text-smoke uppercase tracking-widest font-[family-name:var(--font-accent)]">Received</span>
                        <p className="text-silver mt-0.5">{formatDate(sub.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <p className="text-[10px] tracking-widest uppercase text-smoke font-[family-name:var(--font-accent)] mb-2">Message</p>
                      <p className="text-off-white/90 text-sm font-[family-name:var(--font-body)] leading-relaxed whitespace-pre-wrap bg-graphite rounded-sm px-4 py-3">
                        {sub.message}
                      </p>
                    </div>

                    <div className="mb-5">
                      <p className="text-[10px] tracking-widest uppercase text-smoke font-[family-name:var(--font-accent)] mb-2">Notes</p>
                      <textarea
                        rows={2}
                        value={notes[sub.id] ?? sub.adminNotes ?? ""}
                        onChange={(e) => setNotes((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                        placeholder="Add private notes..."
                        className="w-full bg-graphite border border-smoke rounded-sm px-3 py-2 text-silver text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold resize-none transition-colors"
                      />
                      <button
                        onClick={() => notesMutation.mutate({ id: sub.id, adminNotes: notes[sub.id] ?? "" })}
                        disabled={notesMutation.isPending}
                        className="mt-1.5 text-xs text-silver hover:text-gold transition-colors font-[family-name:var(--font-body)] disabled:opacity-50"
                      >
                        {notesMutation.isPending ? "Saving…" : "Save notes"}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] tracking-widest uppercase text-smoke font-[family-name:var(--font-accent)] mr-1">Mark as</span>
                      {(["NEW", "READ", "REPLIED", "ARCHIVED"] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => statusMutation.mutate({ id: sub.id, status: s })}
                          disabled={sub.status === s || statusMutation.isPending}
                          className={`text-xs px-3 py-1 border rounded transition-colors font-[family-name:var(--font-accent)] tracking-widest uppercase disabled:opacity-40 disabled:cursor-default ${
                            sub.status === s
                              ? STATUS_CONFIG[s].className + " border"
                              : "border-smoke/40 text-silver hover:border-gold/40 hover:text-gold"
                          }`}
                        >
                          {STATUS_CONFIG[s].label}
                        </button>
                      ))}
                      <a
                        href={`mailto:${sub.email}?subject=Re: ${sub.projectType ?? "Your inquiry"}`}
                        className="ml-auto text-xs px-3 py-1 bg-gold text-cin-black font-[family-name:var(--font-body)] tracking-widest uppercase hover:bg-pale-gold transition-colors"
                      >
                        Reply ↗
                      </a>
                      <button
                        onClick={() => {
                          if (confirm("Delete this inquiry? This cannot be undone."))
                            deleteMutation.mutate(sub.id);
                        }}
                        disabled={deleteMutation.isPending}
                        className="text-xs text-silver hover:text-red-400 transition-colors font-[family-name:var(--font-body)] disabled:opacity-50"
                      >
                        {deleteMutation.isPending ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
