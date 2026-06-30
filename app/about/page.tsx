import { prisma } from "@/lib/prisma";
import StatsCounter from "@/components/StatsCounter";
import Link from "next/link";

export const metadata = {
  title: "About",
  description:
    "Meet Samwills — cinematographer and visual storyteller based in Lagos, Nigeria. The person behind the lens.",
  openGraph: {
    title: "About Samwills",
    description: "Cinematographer and visual storyteller based in Lagos, Nigeria.",
    url: "/about",
  },
  twitter: {
    title: "About Samwills",
    description: "Cinematographer and visual storyteller based in Lagos, Nigeria.",
  },
};

async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(
    settings.map((s: { key: string; value: string }) => [s.key, s.value]),
  );
}

export default async function AboutPage() {
  const settings = await getSettings();

  const bio = settings.about_bio ?? "";
  const craft = settings.about_craft ?? "";
  const bioParagraphs = bio.split("\n\n").filter(Boolean);

  return (
    <div className="pt-24 pb-20 bg-cin-black min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Hero section */}
        <div className="mb-16 md:mb-20">
          <p className="font-[family-name:var(--font-display)] italic text-gold text-sm tracking-widest uppercase mb-3">
            The Story
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-off-white font-light mb-6">
            The Person Behind the Lens
          </h1>

          {/* Divider */}
          <div className="h-px w-16 bg-gold mb-10" />
        </div>

        {/* Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16 mb-20">
          {/* Placeholder portrait */}
          <div className="lg:col-span-2">
            <div className="aspect-[3/4] bg-charcoal rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border border-smoke mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-smoke"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
                  </div>
                  <p className="text-smoke text-xs tracking-widest uppercase font-[family-name:var(--font-accent)]">
                    Samwills
                  </p>
                </div>
              </div>
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cin-black/30 to-transparent" />
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            {bioParagraphs.map((para: string, i: number) => (
              <p
                key={i}
                className="text-off-white/90 text-base md:text-lg font-[family-name:var(--font-body)] leading-relaxed mb-5"
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Pull quote */}
        <div className="border-l-2 border-gold pl-8 mb-20">
          <p className="font-[family-name:var(--font-display)] italic text-2xl md:text-3xl text-off-white/80 leading-relaxed">
            &ldquo;I believe every story deserves to be told beautifully — and
            I&apos;m here to make sure yours is.&rdquo;
          </p>
          <p className="text-gold text-sm mt-4 font-[family-name:var(--font-accent)] tracking-widest">
            — Samwills
          </p>
        </div>

        {/* The Craft */}
        {craft && (
          <div className="mb-20">
            <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-off-white mb-6">
              The Craft
            </h2>
            <p className="text-silver text-base md:text-lg font-[family-name:var(--font-body)] leading-relaxed max-w-2xl">
              {craft}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="bg-charcoal rounded-sm p-10 mb-16">
          <div className="grid grid-cols-3 gap-6 text-center">
            <StatsCounter
              value={parseInt(settings.stat_projects ?? "100")}
              label="Projects Completed"
              suffix="+"
            />
            <StatsCounter
              value={parseInt(settings.stat_clients ?? "50")}
              label="Clients Served"
              suffix="+"
            />
            <StatsCounter
              value={parseInt(settings.stat_years ?? "5")}
              label="Years Experience"
              suffix="+"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-gold text-cin-black text-sm tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors duration-300"
          >
            Let&apos;s Work Together
          </Link>
        </div>
      </div>
    </div>
  );
}
