import Link from "next/link";

const socials = [
  { label: "Instagram", handle: "@visualsbysamwills", href: "https://instagram.com/visualsbysamwills" },
  { label: "TikTok", handle: "@visualsbysamwills", href: "https://tiktok.com/@visualsbysamwills" },
  { label: "YouTube", handle: "Visuals by Samwills", href: "https://youtube.com/@visualsbysamwills" },
  { label: "Twitter / X", handle: "@samwills", href: "https://twitter.com/samwills" },
];

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-smoke/40 bg-charcoal">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* Brand */}
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl tracking-widest text-off-white mb-3">
              VISUALS BY SAMWILLS
            </p>
            <p className="text-silver text-sm leading-relaxed">
              Every frame tells your story.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gold mb-4 font-[family-name:var(--font-accent)]">
              Navigate
            </p>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-silver hover:text-off-white transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <p className="text-xs tracking-widest uppercase text-gold mb-4 font-[family-name:var(--font-accent)]">
              Follow
            </p>
            <div className="flex flex-col gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-silver hover:text-off-white transition-colors duration-300 flex items-center gap-2"
                >
                  <span>{s.label}</span>
                  <span className="text-smoke">·</span>
                  <span className="text-xs text-smoke hover:text-silver transition-colors">
                    {s.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-smoke/40 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-smoke">
            © {new Date().getFullYear()} Visuals by Samwills. All rights reserved.
          </p>
          <p className="text-xs text-smoke">
            Based in Nigeria · Available nationwide
          </p>
        </div>
      </div>
    </footer>
  );
}
