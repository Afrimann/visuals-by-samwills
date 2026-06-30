"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface Segment {
  id: string;
  name: string;
}

interface VideoFormData {
  id?: string;
  title?: string;
  segmentId?: string;
  videoUrl?: string;
  thumbnailUrl?: string | null;
  description?: string | null;
  status?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  year?: number | null;
}

interface Props {
  segments: Segment[];
  initialData?: VideoFormData;
}

export default function VideoForm({ segments, initialData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: initialData?.title ?? "",
    segmentId: initialData?.segmentId ?? segments[0]?.id ?? "",
    videoUrl: initialData?.videoUrl ?? "",
    thumbnailUrl: initialData?.thumbnailUrl ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? "DRAFT",
    isFeatured: initialData?.isFeatured ?? false,
    sortOrder: initialData?.sortOrder ?? 0,
    year: initialData?.year ?? new Date().getFullYear(),
  });

  const isEdit = !!initialData?.id;

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit ? `/api/videos/${initialData!.id}` : "/api/videos";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? "Something went wrong");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      router.push("/admin/videos");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/videos/${initialData!.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
      router.push("/admin/videos");
    },
  });

  // Auto-generate YouTube thumbnail from URL
  const autoThumb = formData.videoUrl.includes("youtube") || formData.videoUrl.includes("youtu.be")
    ? (() => {
        try {
          const url = new URL(formData.videoUrl);
          const id = url.searchParams.get("v") ?? url.pathname.slice(1);
          return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : "";
        } catch {
          return "";
        }
      })()
    : "";

  const previewThumb = formData.thumbnailUrl || autoThumb;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Main fields */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Title *
          </label>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
            placeholder="Artist Name — Song Title"
          />
        </div>

        {/* Segment */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Segment *
          </label>
          <select
            value={formData.segmentId}
            onChange={(e) => setFormData({ ...formData, segmentId: e.target.value })}
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          >
            {segments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Video URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Video URL * (YouTube or Vimeo)
          </label>
          <input
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            required
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Thumbnail URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Thumbnail URL (leave blank to auto-detect from YouTube)
          </label>
          <input
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
            placeholder="https://..."
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors resize-none"
            placeholder="Brief description of this video..."
          />
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Year
          </label>
          <input
            type="number"
            value={formData.year ?? ""}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
            placeholder="2024"
            min="2000"
            max="2099"
          />
        </div>

        {saveMutation.error && (
          <p className="text-red-400 text-sm font-[family-name:var(--font-body)]">
            {(saveMutation.error as Error).message}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="px-6 py-3 bg-gold text-cin-black text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Video"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-smoke text-silver text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:border-silver hover:text-off-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-5">
        {/* Preview thumbnail */}
        <div>
          <p className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)] mb-2">
            Thumbnail Preview
          </p>
          <div className="aspect-video bg-graphite rounded-sm overflow-hidden">
            {previewThumb ? (
              <Image
                src={previewThumb}
                alt="Thumbnail preview"
                width={400}
                height={225}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-smoke text-xs">No thumbnail</p>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Status
          </label>
          <div className="flex gap-3">
            {["PUBLISHED", "DRAFT"].map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={formData.status === s}
                  onChange={() => setFormData({ ...formData, status: s })}
                  className="accent-gold"
                />
                <span className="text-sm text-off-white font-[family-name:var(--font-body)]">
                  {s === "PUBLISHED" ? "Published" : "Draft"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Featured */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 accent-gold"
          />
          <span className="text-sm text-off-white font-[family-name:var(--font-body)]">
            Featured on homepage
          </span>
        </label>

        {/* Sort Order */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sortOrder}
            onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {/* Delete */}
        {isEdit && (
          <div className="mt-4 pt-4 border-t border-smoke/40">
            <p className="text-xs tracking-widest uppercase text-smoke mb-3 font-[family-name:var(--font-accent)]">
              Danger Zone
            </p>
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this video? This cannot be undone.")) deleteMutation.mutate();
              }}
              disabled={deleteMutation.isPending}
              className="w-full py-2.5 border border-red-800/50 text-red-500 text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:border-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Video"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
