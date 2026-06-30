import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cin-black flex flex-col items-center justify-center text-center px-6">
      <p className="font-[family-name:var(--font-accent)] text-gold text-xs tracking-[0.4em] uppercase mb-4">
        404
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl text-off-white mb-4">
        Scene Missing
      </h1>
      <p className="font-[family-name:var(--font-body)] text-silver text-base max-w-md mb-10">
        This frame didn&apos;t make the cut. Let&apos;s get you back to the reel.
      </p>
      <Link
        href="/"
        className="px-8 py-3 border border-gold text-gold text-xs tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-gold hover:text-cin-black transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
