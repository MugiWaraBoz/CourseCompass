import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null;
  return <div className="mt-10 flex items-center justify-center gap-3"><button disabled={page <= 1} onClick={() => onChange(page - 1)} className="grid size-10 place-items-center rounded-full border bg-white disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="size-4"/></button><span className="text-sm text-slate-600">Page <strong>{page}</strong> of {totalPages}</span><button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="grid size-10 place-items-center rounded-full border bg-white disabled:opacity-40" aria-label="Next page"><ChevronRight className="size-4"/></button></div>;
}
