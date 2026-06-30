"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Collaboration {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  sortOrder: number;
}

export default function CollaborationManager({
  initialCollabs,
}: {
  initialCollabs: Collaboration[];
}) {
  const router = useRouter();
  const [collabs, setCollabs] = useState(initialCollabs);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emptyForm = { name: "", logoUrl: "", websiteUrl: "", description: "", sortOrder: 0 };
  const [formData, setFormData] = useState(emptyForm);

  function startEdit(c: Collaboration) {
    setEditingId(c.id);
    setFormData({
      name: c.name,
      logoUrl: c.logoUrl ?? "",
      websiteUrl: c.websiteUrl ?? "",
      description: c.description ?? "",
      sortOrder: c.sortOrder,
    });
    setShowForm(false);
  }

  function startNew() {
    setEditingId(null);
    setFormData({ ...emptyForm, sortOrder: collabs.length });
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
    const url = editingId ? `/api/collaborations/${editingId}` : "/api/collaborations";

    const payload = {
      name: formData.name,
      logoUrl: formData.logoUrl || null,
      websiteUrl: formData.websiteUrl || null,
      description: formData.description || null,
      sortOrder: formData.sortOrder,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.refresh();
      const data: Collaboration = await res.json();
      if (editingId) {
        setCollabs(collabs.map((c) => (c.id === editingId ? data : c)));
      } else {
        setCollabs([...collabs, data]);
      }
      cancel();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
    }
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from collaborations?`)) return;
    const res = await fetch(`/api/collaborations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCollabs(collabs.filter((c) => c.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {collabs.map((c) => (
        <div key={c.id} className="bg-charcoal border border-smoke/40 rounded-sm">
          {editingId === c.id ? (
            <div className="p-5">
              <CollabForm
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
              {c.logoUrl ? (
                <div className="w-10 h-10 rounded-sm overflow-hidden bg-graphite flex-shrink-0">
                  <Image
                    src={c.logoUrl}
                    alt={c.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-sm bg-graphite flex-shrink-0 flex items-center justify-center">
                  <span className="text-smoke text-xs font-[family-name:var(--font-accent)]">
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-off-white text-sm font-[family-name:var(--font-body)] font-medium">
                  {c.name}
                </p>
                {c.websiteUrl && (
                  <a
                    href={c.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-silver text-xs hover:text-gold transition-colors"
                  >
                    {c.websiteUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
              <button
                onClick={() => startEdit(c)}
                className="text-xs text-silver hover:text-gold transition-colors font-[family-name:var(--font-body)]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id, c.name)}
                className="text-xs text-silver hover:text-red-400 transition-colors font-[family-name:var(--font-body)]"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {showForm && (
        <div className="bg-charcoal border border-gold/30 rounded-sm p-5">
          <p className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)] mb-4">
            New Collaboration
          </p>
          <CollabForm
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
          + Add Collaboration
        </button>
      )}
    </div>
  );
}

function CollabForm({
  formData,
  setFormData,
  error,
  loading,
  onSave,
  onCancel,
  isEdit,
}: {
  formData: { name: string; logoUrl: string; websiteUrl: string; description: string; sortOrder: number };
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
            placeholder="Sony Music, Burna Boy, etc."
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
          Logo URL
        </label>
        <input
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          className="bg-graphite border border-smoke rounded-sm px-3 py-2 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Website URL
        </label>
        <input
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          className="bg-graphite border border-smoke rounded-sm px-3 py-2 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Description
        </label>
        <input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-graphite border border-smoke rounded-sm px-3 py-2 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          placeholder="Brief note..."
        />
      </div>

      {error && <p className="text-red-400 text-xs font-[family-name:var(--font-body)]">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={loading}
          className="px-5 py-2 bg-gold text-cin-black text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Collaboration"}
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
