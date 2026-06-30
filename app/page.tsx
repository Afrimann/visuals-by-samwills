import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatsCounter from "@/components/StatsCounter";
import HeroReel from "@/components/HeroReel";

async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  return Object.fromEntries(settings.map((s) => [s.key, s.value]));
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero */}
      <HeroReel />

      {/* Stats */}
      <section className="bg-charcoal border-t border-smoke/40 py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-3 gap-6 md:gap-10 text-center">
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
              label="Years of Experience"
              suffix="+"
            />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-20 md:py-28 bg-cin-black">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <p className="font-[family-name:var(--font-display)] italic text-silver text-sm tracking-widest uppercase mb-5">
            Ready to make something?
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-off-white mb-8">
            Let&apos;s Tell Your Story
          </h2>
          <div className="flex items-center justify-center gap-5 flex-wrap">
            <Link
              href="/portfolio"
              className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-cin-black transition-all duration-300 text-sm tracking-widest uppercase font-[family-name:var(--font-body)]"
            >
              See the Work
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-gold text-cin-black hover:bg-pale-gold transition-all duration-300 text-sm tracking-widest uppercase font-[family-name:var(--font-body)]"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
