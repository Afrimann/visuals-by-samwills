"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/videos", label: "Videos" },
  { href: "/admin/segments", label: "Segments" },
  { href: "/admin/collaborations", label: "Collaborations" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/admin", { method: "DELETE" });
    router.push("/admin/sign-in");
    router.refresh();
  }

  function isActive(tab: (typeof tabs)[number]) {
    return tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal border-b border-smoke/40 h-16 flex items-center px-6">
        <Link
          href="/admin"
          className="font-[family-name:var(--font-display)] text-sm tracking-widest text-off-white mr-10"
        >
          ADMIN
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-3 py-1.5 text-xs tracking-widest uppercase font-[family-name:var(--font-accent)] rounded transition-colors ${
                isActive(tab) ? "bg-gold/10 text-gold" : "text-silver hover:text-off-white"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden ml-auto flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-6 bg-off-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-off-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-off-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
          />
        </button>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-cin-black flex flex-col items-center justify-center gap-10"
          >
            {tabs.map((tab, i) => (
              <motion.div
                key={tab.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link
                  href={tab.href}
                  className={`font-[family-name:var(--font-display)] text-4xl italic transition-colors duration-300 ${
                    isActive(tab) ? "text-gold" : "text-off-white hover:text-gold"
                  }`}
                >
                  {tab.label}
                </Link>
              </motion.div>
            ))}

            {/* Divider + actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              className="flex items-center gap-8 mt-4"
            >
              <Link
                href="/"
                target="_blank"
                className="text-sm tracking-widest uppercase text-silver hover:text-off-white transition-colors font-[family-name:var(--font-body)]"
              >
                View Site ↗
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm tracking-widest uppercase text-silver hover:text-red-400 transition-colors font-[family-name:var(--font-body)]"
              >
                Sign Out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
