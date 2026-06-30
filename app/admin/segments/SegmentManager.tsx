"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Segment {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accentColor: string;
  sortOrder: number;
  _count: { videos: number };
}

const PRESET_COLORS = [
  { label: "Purple", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Emerald", value: "#10b981" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Gold", value: "#c9a84c" },
  { label: "Red", value: "#ef4444" },
  { label: "Cyan", value: "#06b6d4" },
];

export default function SegmentManager({ initialSegments }: { initialSegments: Segment[] }) {
  const router = useRouter();
  const [segments, setSegments] = useState(initialSegments);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accentColor: "#c9a84c",
    sortOrder: 0,
  });

  function startEdit(seg: Segment) {
    setEditingId(seg.id);
    setFormData({
      name: seg.name,
      description: seg.description ?? "",
      accentColor: seg.accentColor,
      sortOrder: seg.sortOrder,
    });
    setShowForm(false);
  }

  function startNew() {
    setEditingId(null);
    setFormData({ name: "", description: "", accentColor: "#c9a84c", sortOrder: segments.length });
    setShowForm(true);
  }

  function cancel() {
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  async function handleSave() {
    if (!formData.name.trim()) { setError("Name is required"); return; }
    setLoading(true);
    setError("");

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/segments/${editingId}` : "/api/segments";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.refresh();
      const data = await res.json();
      if (editingId) {
        setSegments(segments.map((s) => (s.id === editingId ? { ...s, ...data } : s)));
      } else {
        setSegments([...segments, { ...data, _count: { videos: 0 } }]);
      }
      cancel();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete segment "${name}"?`)) return;
    const res = await fetch(`/api/segments/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSegments(segments.filter((s) => s.id !== id));
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Delete failed");
    }
  }

  const isEditing = (id: string) => editingId === id;

  return (
    <div className="flex flex-col gap-3">
      {/* Existing segments */}
      {segments.map((seg) => (
        <div
          key={seg.id}
          className="bg-charcoal border border-smoke/40 rounded-sm"
        >
          {isEditing(seg.id) ? (
            <div className="p-5">
              <SegmentForm
                formData={formData}
                setFormData={setFormData}
                error={error}
                loading={loading}
                onSave={handleSave}
                onCancel={cancel}
                isEdit
              />
            </div>
          ) : (
            <div className="flex items-center gap-4 px-5 py-4">
              <div
                className="w-2 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: seg.accentColor }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-off-white text-sm font-[family-name:var(--font-body)] font-medium">
                  {seg.name}
                </p>
                {seg.description && (
                  <p className="text-silver text-xs mt-0.5 line-clamp-1">{seg.description}</p>
                )}
              </div>
              <span className="text-smoke text-xs font-[family-name:var(--font-body)]">
                {seg._count.videos} video{seg._count.videos !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => startEdit(seg)}
                className="text-xs text-silver hover:text-gold transition-colors font-[family-name:var(--font-body)]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(seg.id, seg.name)}
                disabled={seg._count.videos > 0}
                className="text-xs text-silver hover:text-red-400 transition-colors font-[family-name:var(--font-body)] disabled:opacity-30 disabled:cursor-not-allowed"
                title={seg._count.videos > 0 ? "Remove all videos first" : "Delete"}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* New segment form */}
      {showForm && (
        <div className="bg-charcoal border border-gold/30 rounded-sm p-5">
          <p className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)] mb-4">
            New Segment
          </p>
          <SegmentForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            loading={loading}
            onSave={handleSave}
            onCancel={cancel}
            isEdit={false}
          />
        </div>
      )}

      {!showForm && !editingId && (
        <button
          onClick={startNew}
          className="mt-2 px-5 py-2.5 border border-dashed border-smoke text-silver text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:border-gold hover:text-gold transition-colors rounded-sm"
        >
          + Add Segment
        </button>
      )}
    </div>
  );
}

function SegmentForm({
  formData,
  setFormData,
  error,
  loading,
  onSave,
  onCancel,
  isEdit,
}: {
  formData: { name: string; description: string; accentColor: string; sortOrder: number };
  setFormData: (d: typeof formData) => void;
  error: string;
  loading: boolean;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Name *
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-graphite border border-smoke rounded-sm px-3 py-2 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
            placeholder="Music Videos"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            className="bg-graphite border border-smoke rounded-sm px-3 py-2 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Description
        </label>
        <input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-graphite border border-smoke rounded-sm px-3 py-2 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          placeholder="Brief description..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Accent Color
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFormData({ ...formData, accentColor: c.value })}
              className="w-6 h-6 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c.value,
                borderColor: formData.accentColor === c.value ? "#f2f0ec" : "transparent",
              }}
              title={c.label}
            />
          ))}
          <input
            type="color"
            value={formData.accentColor}
            onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer bg-transparent border border-smoke"
            title="Custom color"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-xs font-[family-name:var(--font-body)]">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={loading}
          className="px-5 py-2 bg-gold text-cin-black text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Segment"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 border border-smoke text-silver text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:border-silver hover:text-off-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
