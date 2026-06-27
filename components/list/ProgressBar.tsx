import { WEEKLY_TARGET_HOURS } from "@/lib/types";
import { TEXT } from "@/constants/TEXT_CONSTANTS";

interface ProgressBarProps {
  total: number;
  target?: number;
}

export function ProgressBar({
  total,
  target = WEEKLY_TARGET_HOURS,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((total / target) * 100));

  return (
    <div className="w-48">
      <div className="mb-1.5 text-right text-sm font-semibold text-ink">
        {total}/{target} {TEXT.units.hours}
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-orange-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-muted">{pct}%</span>
      </div>
    </div>
  );
}
