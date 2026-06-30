import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [videoCount, segmentCount, collabCount, newInquiries] = await Promise.all([
    prisma.video.count(),
    prisma.segment.count(),
    prisma.collaboration.count(),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
  ]);

  const recentVideos = await prisma.video.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true, createdAt: true, segment: { select: { name: true } } },
  });

  const stats = [
    { label: "Total Videos", value: videoCount, href: "/admin/videos" },
    { label: "Segments", value: segmentCount, href: "/admin/segments" },
    { label: "Collaborations", value: collabCount, href: "/admin/collaborations" },
    { label: "New Inquiries", value: newInquiries, href: "#" },
  ];

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

      {/* Stats */}
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
          {recentVideos.map((v: (typeof recentVideos)[number], i: number) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
