"use client";

import { useState } from "react";
import type { GoalDTO } from "@/lib/types";

export default function GoalForm({
  year,
  goal,
  onCancel,
  onSaved,
}: {
  year: number;
  goal: GoalDTO | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [booksGoal, setBooksGoal] = useState(String(goal?.booksGoal ?? 24));
  const [dailyPages, setDailyPages] = useState(String(goal?.dailyPages ?? 30));
  const [targetGenre, setTargetGenre] = useState(goal?.targetGenre ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/goals/${year}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booksGoal: Number(booksGoal),
        dailyPages: Number(dailyPages),
        targetGenre,
      }),
    });
    setSaving(false);
    if (res.ok) {
      onSaved();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save goal.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Books goal for {year}
          </label>
          <input
            type="number"
            min={1}
            value={booksGoal}
            onChange={(e) => setBooksGoal(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-wood focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-muted">
            Daily pages goal
          </label>
          <input
            type="number"
            min={1}
            value={dailyPages}
            onChange={(e) => setDailyPages(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-wood focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wide text-muted">
          Target genre (optional)
        </label>
        <input
          type="text"
          placeholder="e.g. Fiction — doesn't affect any analysis"
          value={targetGenre}
          onChange={(e) => setTargetGenre(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-wood focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-accent-red">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-wood-dark px-4 py-2 text-sm font-bold text-white hover:bg-wood disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Goal"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-4 py-2 text-sm text-muted hover:bg-panel-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
