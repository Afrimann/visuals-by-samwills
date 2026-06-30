"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSignInPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cin-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-widest text-off-white mb-1">
            VISUALS BY SAMWILLS
          </p>
          <p className="text-silver text-sm font-[family-name:var(--font-body)] tracking-widest uppercase">
            Admin Access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] placeholder:text-smoke focus:outline-none focus:border-gold transition-colors"
          />
          {error && (
            <p className="text-red-400 text-sm font-[family-name:var(--font-body)]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold text-cin-black text-sm tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
