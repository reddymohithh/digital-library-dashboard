"use client";

import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "@/lib/AdminContext";
import type { DailyLogDTO, GoalDTO } from "@/lib/types";
import DonutChart from "./DonutChart";
import GoalCalendar from "./GoalCalendar";
import GoalForm from "./GoalForm";

type Stats = {
  finishedCount: number;
  percent: number;
  genreBreakdown: { genre: string; count: number }[];
  pagesRead: number;
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export default function GoalsPanel({ onClose }: { onClose: () => void }) {
  const { isAdmin } = useAdmin();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  });
  const year = month.getUTCFullYear();

  const [goal, setGoal] = useState<GoalDTO | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<DailyLogDTO[]>([]);
  const [editingGoal, setEditingGoal] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [goalRes, logsRes] = await Promise.all([
      fetch(`/api/goals/${year}`),
      fetch(`/api/daily-log?year=${year}`),
    ]);
    if (goalRes.ok) {
      const goalJson = await goalRes.json();
      setGoal(goalJson.goal);
      setStats(goalJson.stats);
    }
    if (logsRes.ok) {
      const logsJson = await logsRes.json();
      setLogs(logsJson.logs ?? []);
    }
    setLoading(false);
  }, [year]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleCheckIn(status: "MET" | "PARTIAL" | "MISSED") {
    setCheckingIn(true);
    await fetch(`/api/daily-log/${todayKey()}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setCheckingIn(false);
    refresh();
  }

  const todayStatus = logs.find((l) => l.date.slice(0, 10) === todayKey())?.status;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-panel-muted shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border bg-panel px-6 py-4">
          <h2 className="font-serif-heading text-xl font-bold">Reading Goals {year}</h2>
          <button onClick={onClose} aria-label="Close" className="text-lg">
            ✕
          </button>
        </div>

        <div className="space-y-5 p-6">
          <section className="rounded-xl border border-border bg-panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-muted">
                Goals Set
              </span>
              {isAdmin && !editingGoal && (
                <button
                  onClick={() => setEditingGoal(true)}
                  className="rounded-md border border-border px-3 py-1 text-xs font-bold hover:bg-panel-muted"
                >
                  {goal ? "Edit" : "Set Goal"}
                </button>
              )}
            </div>

            {editingGoal ? (
              <GoalForm
                year={year}
                goal={goal}
                onCancel={() => setEditingGoal(false)}
                onSaved={() => {
                  setEditingGoal(false);
                  refresh();
                }}
              />
            ) : goal ? (
              <div className="space-y-3">
                <GoalRow icon="📚" title={`${goal.booksGoal} books`} subtitle={`Target for ${year}`} />
                <GoalRow icon="📄" title={`${goal.dailyPages} pages / day`} subtitle="Daily reading goal" />
                <GoalRow
                  icon="🏷️"
                  title={goal.targetGenre || "Not set"}
                  subtitle="Target genre (optional)"
                />
              </div>
            ) : (
              <p className="text-sm text-muted">
                No goal set for {year} yet.{" "}
                {isAdmin ? "Click “Set Goal” to create one." : ""}
              </p>
            )}
          </section>

          {goal && stats && (
            <section className="rounded-xl border border-border bg-panel p-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
                Progress — {year}
              </div>
              <DonutChart
                percent={stats.percent}
                finishedCount={stats.finishedCount}
                goalCount={goal.booksGoal}
              />
            </section>
          )}

          {isAdmin && goal && (
            <section className="rounded-xl border border-border bg-panel p-5">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
                Today&rsquo;s Check-in
              </div>
              <p className="mb-3 text-sm text-muted">Daily goal: {goal.dailyPages} pages</p>
              <div className="flex gap-2">
                <CheckInButton
                  label="✓ Met Goal"
                  active={todayStatus === "MET"}
                  color="green"
                  disabled={checkingIn}
                  onClick={() => handleCheckIn("MET")}
                />
                <CheckInButton
                  label="~ Partial"
                  active={todayStatus === "PARTIAL"}
                  color="orange"
                  disabled={checkingIn}
                  onClick={() => handleCheckIn("PARTIAL")}
                />
                <CheckInButton
                  label="✗ Missed"
                  active={todayStatus === "MISSED"}
                  color="red"
                  disabled={checkingIn}
                  onClick={() => handleCheckIn("MISSED")}
                />
              </div>
            </section>
          )}

          <section className="rounded-xl border border-border bg-panel p-5">
            <GoalCalendar month={month} onMonthChange={setMonth} logs={logs} />
          </section>

          {stats && (
            <section className="rounded-xl border border-border bg-panel p-5">
              <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">
                Year in Review — {year}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold">{stats.finishedCount}</div>
                  <div className="text-muted">Books finished</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.pagesRead}</div>
                  <div className="text-muted">Pages read</div>
                </div>
              </div>
              {stats.genreBreakdown.length > 0 && (
                <div className="mt-4">
                  <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">
                    By genre
                  </div>
                  <div className="space-y-1">
                    {stats.genreBreakdown.map((g) => (
                      <div key={g.genre} className="flex justify-between text-sm">
                        <span>{g.genre}</span>
                        <span className="text-muted">{g.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {loading && <p className="text-center text-sm text-muted">Loading…</p>}
        </div>
      </div>
    </div>
  );
}

function GoalRow({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-muted text-lg">
        {icon}
      </span>
      <div>
        <div className="font-bold">{title}</div>
        <div className="text-xs text-muted">{subtitle}</div>
      </div>
    </div>
  );
}

function CheckInButton({
  label,
  active,
  color,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  color: "green" | "orange" | "red";
  disabled: boolean;
  onClick: () => void;
}) {
  const colorClasses = {
    green: active
      ? "bg-accent-green text-white border-accent-green"
      : "border-accent-green/40 text-accent-green",
    orange: active
      ? "bg-accent-orange text-white border-accent-orange"
      : "border-accent-orange/40 text-accent-orange",
    red: active
      ? "bg-accent-red text-white border-accent-red"
      : "border-accent-red/40 text-accent-red",
  }[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 rounded-lg border-2 py-2 text-sm font-bold transition disabled:opacity-60 ${colorClasses}`}
    >
      {label}
    </button>
  );
}
