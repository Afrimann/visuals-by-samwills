"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

interface AdminVideo {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  status: string;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date | string;
  segment: { name: string; accentColor: string };
}

async function fetchAdminVideos(): Promise<AdminVideo[]> {
  const res = await fetch("/api/videos");
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
}

export default function VideoListClient({ initialVideos }: { initialVideos: AdminVideo[] }) {
  const queryClient = useQueryClient();

  const { data: videos = [] } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: fetchAdminVideos,
    initialData: initialVideos,
    initialDataUpdatedAt: Date.now(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-videos"] }),
  });

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  }

  return (
    <div className="bg-charcoal border border-smoke/40 rounded-sm overflow-hidden">
      {videos.map((v: AdminVideo, i: number) => (
        <div
          key={v.id}
          className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 transition-colors ${
            deleteMutation.isPending ? "opacity-60" : ""
          } ${i !== videos.length - 1 ? "border-b border-smoke/40" : ""}`}
        >
          {/* Thumbnail */}
          <div className="w-14 sm:w-16 aspect-video shrink-0 bg-graphite rounded-sm overflow-hidden">
            {v.thumbnailUrl ? (
              <Image
                src={v.thumbnailUrl}
                alt=""
                width={64}
                height={36}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-4 h-4 text-smoke" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-off-white text-sm font-[family-name:var(--font-body)] font-medium line-clamp-1">
              {v.title}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="text-[10px] tracking-widest uppercase font-[family-name:var(--font-accent)]"
                style={{ color: v.segment.accentColor }}
              >
                {v.segment.name}
              </span>
              <span
                className={`text-[10px] tracking-widest uppercase px-1.5 py-0.5 rounded-full border font-[family-name:var(--font-accent)] ${
                  v.status === "PUBLISHED"
                    ? "text-green-400 bg-green-400/10 border-green-400/30"
                    : "text-smoke bg-smoke/10 border-smoke/30"
                }`}
              >
                {v.status === "PUBLISHED" ? "Live" : "Draft"}
              </span>
              {v.isFeatured && (
                <span className="text-[10px] text-gold font-[family-name:var(--font-accent)] tracking-widest">
                  ★ Featured
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/admin/videos/${v.id}`}
              className="px-3 py-1.5 border border-smoke/60 text-xs text-silver hover:border-gold hover:text-gold transition-colors font-[family-name:var(--font-body)] rounded-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => handleDelete(v.id, v.title)}
              disabled={deleteMutation.isPending}
              className="px-3 py-1.5 border border-smoke/60 text-xs text-silver hover:border-red-500/60 hover:text-red-400 transition-colors font-[family-name:var(--font-body)] rounded-sm disabled:opacity-40"
            >
              {deleteMutation.isPending ? "…" : "Delete"}
            </button>
          </div>
        </div>
      ))}

      {videos.length === 0 && (
        <div className="py-12 text-center text-silver text-sm font-[family-name:var(--font-body)]">
          No videos yet.{" "}
          <Link href="/admin/videos/new" className="text-gold underline">
            Add your first video
          </Link>
        </div>
      )}
    </div>
  );
}
