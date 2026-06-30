import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Collaborations — Visuals by Samwills",
  description: "Brands and artists we've worked with.",
};

export default async function CollaborationsPage() {
  const collaborations = await prisma.collaboration.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="pt-24 pb-20 bg-cin-black min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="mb-14 md:mb-18">
          <p className="font-[family-name:var(--font-display)] italic text-gold text-sm tracking-widest uppercase mb-3">
            Who We&apos;ve Worked With
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl text-off-white font-light mb-3">
            Brands & Artists
          </h1>
          <div className="h-px w-16 bg-gold mt-6" />
        </div>

        {/* Logo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {collaborations.map((collab: (typeof collaborations)[number]) => (
            <div
              key={collab.id}
              className="bg-charcoal rounded-sm p-8 flex items-center justify-center group hover:bg-graphite transition-colors duration-300 border border-smoke/30 hover:border-gold/30"
            >
              {collab.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={collab.logoUrl}
                  alt={collab.name}
                  className="max-h-12 max-w-full object-contain filter brightness-50 group-hover:brightness-100 transition-all duration-300"
                />
              ) : (
                <p className="font-[family-name:var(--font-display)] text-sm text-smoke group-hover:text-silver transition-colors duration-300 text-center tracking-wide">
                  {collab.name}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border-t border-smoke/40 pt-14 text-center">
          <p className="font-[family-name:var(--font-display)] italic text-silver text-lg mb-6">
            Want to be on this list?
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 bg-gold text-cin-black text-sm tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors duration-300"
          >
            Let&apos;s Collaborate
          </a>
        </div>
      </div>
    </div>
  );
}
