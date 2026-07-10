"use client";

export default function DonutChart({
  percent,
  finishedCount,
  goalCount,
}: {
  percent: number;
  finishedCount: number;
  goalCount: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-32 w-32 shrink-0">
        <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--border)" strokeWidth="12" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="var(--wood)"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold">{finishedCount}</div>
          <div className="text-xs text-muted">of {goalCount}</div>
          <div className="text-sm font-bold text-wood-dark">{clamped}%</div>
        </div>
      </div>
      <div>
        <p className="font-bold">
          {finishedCount} book{finishedCount === 1 ? "" : "s"} read
        </p>
        <p className="text-sm text-muted">
          Goal: {goalCount} book{goalCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
