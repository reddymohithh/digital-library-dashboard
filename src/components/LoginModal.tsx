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
        className="w-full max-w-[340px] rounded-[14px] bg-panel-soft p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-serif-heading text-center text-[19px] font-bold text-foreground">
          📚 Admin Login
        </h2>
        <p className="mt-1.5 text-center text-[13px] text-muted">
          Sign in to manage the library.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          <div>
            <label
              htmlFor="username"
              className="block text-[10px] font-bold uppercase text-muted-light"
              style={{ letterSpacing: "0.08em" }}
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] font-bold uppercase text-muted-light"
              style={{ letterSpacing: "0.08em" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
              required
            />
          </div>

          {error && <div className="text-center text-[13px] text-accent-red">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[7px] bg-wood py-[11px] text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[7px] border border-border-soft bg-panel-soft py-[11px] text-[13px] text-muted hover:bg-panel-muted"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
