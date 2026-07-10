"use client";

import { useState } from "react";
import { useAdmin } from "@/lib/AdminContext";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { login } = useAdmin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await login(username, password);
    setSubmitting(false);
    if (result.ok) {
      onClose();
    } else {
      setError(result.error ?? "Invalid username or password.");
      setPassword("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-panel p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif-heading text-2xl font-bold text-center">
          📚 Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in to manage the library.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wide text-muted">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-wood focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wide text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2.5 text-sm focus:border-wood focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="text-center text-sm text-accent-red">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-wood py-2.5 text-sm font-bold text-white transition hover:bg-wood-dark disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-border py-2.5 text-sm text-muted transition hover:bg-panel-muted"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
