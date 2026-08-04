import { AlertCircle, LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading..." }) {
  return <div className="grid min-h-64 place-items-center text-slate-500"><div className="flex items-center gap-2"><LoaderCircle className="size-5 animate-spin" />{label}</div></div>;
}

export function ErrorState({ message, onRetry }) {
  return <div className="mx-auto my-10 max-w-xl rounded-3xl border border-red-100 bg-red-50 p-8 text-center"><AlertCircle className="mx-auto size-8 text-red-500" /><p className="mt-3 text-red-800">{message}</p>{onRetry && <button onClick={onRetry} className="mt-5 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white">Try again</button>}</div>;
}

export function EmptyState({ title = "Nothing found", text = "Try changing your search or filters." }) {
  return <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/60 p-12 text-center"><h3 className="text-lg font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm text-slate-500">{text}</p></div>;
}

export function SkeletonGrid() {
  return <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-52 animate-pulse rounded-3xl border border-slate-100 bg-white p-6"><div className="h-4 w-24 rounded bg-slate-100"/><div className="mt-5 h-6 w-3/4 rounded bg-slate-100"/><div className="mt-8 h-16 rounded-2xl bg-slate-50"/></div>)}</div>;
}
