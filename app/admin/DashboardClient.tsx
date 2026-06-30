"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

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

interface Segment {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  accentColor: string;
  sortOrder: number;
  _count: { videos: number };
}

interface Collaboration {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
  sortOrder: number;
}

interface Submission {
  id: string;
  status: string;
}

interface Props {
  initialVideos: AdminVideo[];
  initialSegments: Segment[];
  initialCollabs: Collaboration[];
  initialSubmissions: Submission[];
}

const fetchAdminVideos = (): Promise<AdminVideo[]> =>
  fetch("/api/videos", { cache: "no-store" }).then((r) => r.json());

const fetchSegments = (): Promise<Segment[]> =>
  fetch("/api/segments").then((r) => r.json());

const fetchCollabs = (): Promise<Collaboration[]> =>
  fetch("/api/collaborations").then((r) => r.json());

const fetchSubmissions = (): Promise<Submission[]> =>
  fetch("/api/contact").then((r) => r.json());

export default function DashboardClient({
  initialVideos,
  initialSegments,
  initialCollabs,
  initialSubmissions,
}: Props) {
  const { data: videos = [] } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: fetchAdminVideos,
    initialData: initialVideos,
    initialDataUpdatedAt: Date.now(),
  });

  const { data: segments = [] } = useQuery({
    queryKey: ["admin-segments"],
    queryFn: fetchSegments,
    initialData: initialSegments,
    initialDataUpdatedAt: Date.now(),
  });

  const { data: collabs = [] } = useQuery({
    queryKey: ["admin-collabs"],
    queryFn: fetchCollabs,
    initialData: initialCollabs,
    initialDataUpdatedAt: Date.now(),
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: fetchSubmissions,
    initialData: initialSubmissions,
    initialDataUpdatedAt: Date.now(),
  });

  const stats = [
    { label: "Total Videos", value: videos.length, href: "/admin/videos" },
    { label: "Segments", value: segments.length, href: "/admin/segments" },
    { label: "Collaborations", value: collabs.length, href: "/admin/collaborations" },
    {
      label: "New Inquiries",
      value: submissions.filter((s) => s.status === "NEW").length,
      href: "/admin/inquiries",
    },
  ];

  const recentVideos = [...videos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-off-white mb-1">
          Dashboard
        </h1>
        <p className="text-silver text-sm font-[family-name:var(--font-body)]">
          Welcome back, Samwills.
        </p>
      </div>

      {/* Stats — derived from live React Query caches */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-charcoal border border-smoke/40 rounded-sm p-5 hover:border-gold/40 transition-colors"
          >
            <p className="font-[family-name:var(--font-accent)] text-3xl font-bold text-gold mb-1">
              {s.value}
            </p>
            <p className="text-silver text-xs tracking-widest uppercase font-[family-name:var(--font-body)]">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3 mb-10">
        <Link
          href="/admin/videos/new"
          className="px-5 py-2.5 bg-gold text-cin-black text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors"
        >
          + Add Video
        </Link>
        <Link
          href="/admin/collaborations"
          className="px-5 py-2.5 border border-smoke text-silver text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:border-gold hover:text-gold transition-colors"
        >
          + Add Collaboration
        </Link>
      </div>

      {/* Recent videos */}
      <div>
        <h2 className="text-sm tracking-widest uppercase text-gold font-[family-name:var(--font-accent)] mb-4">
          Recent Videos
        </h2>
        <div className="bg-charcoal border border-smoke/40 rounded-sm overflow-hidden">
          {recentVideos.length === 0 ? (
            <div className="py-10 text-center text-silver text-sm font-[family-name:var(--font-body)]">
              No videos yet.
            </div>
          ) : (
            recentVideos.map((v: AdminVideo, i: number) => (
              <Link
                key={v.id}
                href={`/admin/videos/${v.id}`}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-graphite transition-colors ${
                  i !== recentVideos.length - 1 ? "border-b border-smoke/40" : ""
                }`}
              >
                <div>
                  <p className="text-off-white text-sm font-[family-name:var(--font-body)]">{v.title}</p>
                  <p className="text-smoke text-xs mt-0.5">{v.segment.name}</p>
                </div>
                <span
                  className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full font-[family-name:var(--font-accent)] ${
                    v.status === "PUBLISHED"
                      ? "text-green-400 bg-green-400/10 border border-green-400/30"
                      : "text-smoke bg-smoke/10 border border-smoke/30"
                  }`}
                >
                  {v.status === "PUBLISHED" ? "Live" : "Draft"}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
