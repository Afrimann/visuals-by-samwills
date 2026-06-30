"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/segments", label: "Segments" },
  { href: "/admin/collaborations", label: "Collaborations" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/admin", { method: "DELETE" });
    router.push("/admin/sign-in");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal border-b border-smoke/40 h-16 flex items-center px-6">
      <Link
        href="/admin"
        className="font-[family-name:var(--font-display)] text-sm tracking-widest text-off-white mr-10"
      >
        ADMIN
      </Link>

      <nav className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase font-[family-name:var(--font-accent)] rounded transition-colors ${
                active
                  ? "bg-gold/10 text-gold"
                  : "text-silver hover:text-off-white"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="text-xs text-silver hover:text-off-white transition-colors font-[family-name:var(--font-body)]"
        >
          View Site ↗
        </Link>
        <button
          onClick={handleSignOut}
          className="text-xs text-silver hover:text-off-white transition-colors font-[family-name:var(--font-body)]"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
