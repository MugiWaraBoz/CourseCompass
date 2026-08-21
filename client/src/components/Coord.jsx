/**
 * The "coordinate readout" — CourseCompass's signature data chip.
 * Used for anything that functions as a lookup key: course codes,
 * student IDs, faculty short-codes, live counts. Angle brackets read
 * like a map reference, tying the visual language back to the
 * product's own name.
 */
export function Coord({ children, tone = 'cyan', className = '' }) {
  const tones = {
    cyan: 'border-cyan-400/25 bg-cyan-400/5 text-cyan-300',
    slate: 'border-slate-500/25 bg-slate-500/5 text-slate-300',
    amber: 'border-amber-400/25 bg-amber-400/5 text-amber-300',
    emerald: 'border-emerald-400/25 bg-emerald-400/5 text-emerald-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide whitespace-nowrap ${tones[tone]} ${className}`}
    >
      <span className="opacity-50">⟨</span>
      {children}
      <span className="opacity-50">⟩</span>
    </span>
  );
}

export default Coord;
