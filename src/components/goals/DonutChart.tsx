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
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[100px] w-[100px] shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--wood)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[19px] font-bold text-foreground">{finishedCount}</div>
          <div className="text-[10px] text-muted">of {goalCount}</div>
          <div className="text-[11px] font-bold text-wood">{clamped}%</div>
        </div>
      </div>
      <div>
        <p className="text-[13px] font-bold text-foreground">
          {finishedCount} book{finishedCount === 1 ? "" : "s"} read
        </p>
        <p className="text-[12px] text-muted">
          Goal: {goalCount} book{goalCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
