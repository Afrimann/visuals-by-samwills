"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const projectTypes = [
  "Music Video",
  "Wedding Reel",
  "Short Reel",
  "Documentary",
  "Commercial",
  "Other",
];

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");
      setSuccess(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try WhatsApp instead.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full text-center py-20"
      >
        <div className="w-14 h-14 rounded-full border border-gold flex items-center justify-center mb-6">
          <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-off-white mb-2">
          Message Sent
        </h3>
        <p className="text-silver text-sm font-[family-name:var(--font-body)]">
          Samwills will get back to you shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Name *
          </label>
          <input
            name="name"
            required
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] placeholder:text-smoke focus:outline-none focus:border-gold transition-colors"
            placeholder="Your name"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] placeholder:text-smoke focus:outline-none focus:border-gold transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Phone
        </label>
        <input
          name="phone"
          type="tel"
          className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] placeholder:text-smoke focus:outline-none focus:border-gold transition-colors"
          placeholder="+234 800 000 0000"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Project Type
        </label>
        <select
          name="projectType"
          className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] focus:outline-none focus:border-gold transition-colors"
        >
          <option value="">Select project type</option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs tracking-widest uppercase text-gold font-[family-name:var(--font-accent)]">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="bg-charcoal border border-smoke rounded-sm px-4 py-3 text-off-white text-sm font-[family-name:var(--font-body)] placeholder:text-smoke focus:outline-none focus:border-gold transition-colors resize-none"
          placeholder="Tell me about your project..."
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm font-[family-name:var(--font-body)]">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gold text-cin-black text-sm tracking-widest uppercase font-[family-name:var(--font-body)] hover:bg-pale-gold transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send Message →"}
      </button>
    </form>
  );
}
