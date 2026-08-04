// Contains shared labels and input styles used by frontend forms.
export function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}

export const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";
export const textareaClass =
  "mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";
