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
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <FieldLabel>Books goal for {year}</FieldLabel>
          <input
            type="number"
            min={1}
            value={booksGoal}
            onChange={(e) => setBooksGoal(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border-soft px-2.5 py-1.5 text-[13px] focus:border-wood focus:outline-none"
          />
        </div>
        <div>
          <FieldLabel>Daily pages goal</FieldLabel>
          <input
            type="number"
            min={1}
            value={dailyPages}
            onChange={(e) => setDailyPages(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border-soft px-2.5 py-1.5 text-[13px] focus:border-wood focus:outline-none"
          />
        </div>
      </div>
      <div>
        <FieldLabel>Target genre (optional)</FieldLabel>
        <input
          type="text"
          placeholder="e.g. Fiction — doesn't affect any analysis"
          value={targetGenre}
          onChange={(e) => setTargetGenre(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border-soft px-2.5 py-1.5 text-[13px] focus:border-wood focus:outline-none"
        />
      </div>
      {error && <p className="text-[13px] text-accent-red">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-[7px] bg-wood px-3.5 py-2 text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Goal"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[7px] border border-border-soft px-3.5 py-2 text-[13px] text-muted hover:bg-panel-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[10px] font-bold uppercase text-muted-light"
      style={{ letterSpacing: "0.08em" }}
    >
      {children}
    </label>
  );
}
