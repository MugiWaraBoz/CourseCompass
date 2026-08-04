// Formats a numeric rating with a star and optional review count.
import { Star } from "lucide-react";

export default function Rating({ value = 0, count, compact = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <Star className="size-4 fill-amber-400 text-amber-400" />
      <strong className="text-slate-800">
        {Number(value || 0).toFixed(1)}
      </strong>
      {count !== undefined && (
        <span className="text-slate-500">
          ({count} {compact ? "" : "reviews"})
        </span>
      )}
    </span>
  );
}
