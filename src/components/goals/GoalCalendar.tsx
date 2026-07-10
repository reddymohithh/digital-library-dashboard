"use client";

import type { DailyLogDTO } from "@/lib/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_COLOR: Record<string, string> = {
  MET: "bg-accent-green text-white",
  PARTIAL: "bg-accent-orange text-white",
  MISSED: "bg-accent-red text-white",
};

function toDateKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

export default function GoalCalendar({
  month,
  onMonthChange,
  logs,
}: {
  month: Date; // first of month, UTC
  onMonthChange: (next: Date) => void;
  logs: DailyLogDTO[];
}) {
  const logByDate = new Map(logs.map((l) => [l.date.slice(0, 10), l.status]));
  const year = month.getUTCFullYear();
  const monthIndex = month.getUTCMonth();

  const firstDay = new Date(Date.UTC(year, monthIndex, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  // Monday-first weekday index (0=Mon ... 6=Sun)
  const startWeekday = (firstDay.getUTCDay() + 6) % 7;

  const todayKey = toDateKey(new Date());

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => onMonthChange(new Date(Date.UTC(year, monthIndex - 1, 1)))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
        >
          ‹
        </button>
        <span className="font-serif-heading font-bold">
          {MONTH_NAMES[monthIndex]} {year}
        </span>
        <button
          onClick={() => onMonthChange(new Date(Date.UTC(year, monthIndex + 1, 1)))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const key = toDateKey(new Date(Date.UTC(year, monthIndex, day)));
          const status = logByDate.get(key);
          const isToday = key === todayKey;
          return (
            <div
              key={i}
              className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                status ? STATUS_COLOR[status] : "text-foreground/70"
              } ${isToday && !status ? "border-2 border-wood-dark" : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted">
        <span><span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-green" /> Met</span>
        <span><span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-orange" /> Partial</span>
        <span><span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-red" /> Missed</span>
      </div>
    </div>
  );
}
