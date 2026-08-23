import { ArrowLeft, Compass, MapPinOff } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_33%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.18),transparent_30%),linear-gradient(135deg,#020817_0%,#0f172a_48%,#111827_100%)] px-6 py-16 text-slate-50">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-size-[32px_32px]" />

      <div className="relative z-10 w-full max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-2xl shadow-cyan-950/40">
          <MapPinOff className="h-9 w-9" strokeWidth={1.6} />
        </div>
        <p className="text-8xl font-black tracking-tight text-white md:text-9xl">404</p>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          <Compass className="h-3.5 w-3.5" />
          CourseCompass
        </div>
        <h1 className="mt-5 text-3xl font-bold text-white md:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-slate-300">
          The page you are looking for may have moved, or the address may be incorrect.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Return home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;