"use client";

import { useState } from "react";

export default function ChangeCredentialsModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/credentials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newUsername, newPassword }),
    });
    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not update credentials.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[360px] rounded-[14px] bg-panel-soft p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-heading text-[17px] font-bold text-foreground">
            Change Login
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-base text-muted">
            ✕
          </button>
        </div>

        {success ? (
          <div className="space-y-3.5">
            <p className="text-[13px] text-accent-green">
              Your login has been updated. Use the new username and password next time you
              sign in.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-[7px] bg-wood py-[11px] text-[13px] font-bold text-white hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Field
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
              required
            />
            <Field
              label="New Username"
              type="text"
              value={newUsername}
              onChange={setNewUsername}
              autoComplete="username"
              required
            />
            <Field
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              required
            />
            <Field
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              required
            />

            {error && <p className="text-[13px] text-accent-red">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[7px] bg-wood py-[11px] text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="block text-[10px] font-bold uppercase text-muted-light"
        style={{ letterSpacing: "0.08em" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 w-full rounded-lg border border-border-soft px-3 py-2 text-[13px] focus:border-wood focus:outline-none"
      />
    </div>
  );
}
