import { ArrowLeft, Construction, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function UnderDevelopment({ title, description }) {
  return (
    <section className="relative flex min-h-[calc(100vh-57px)] items-center justify-center overflow-hidden px-6 py-16 text-slate-50 md:px-10">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-cyan-300/10 bg-cyan-300/5 blur-2xl" />
      <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-blue-300/10 bg-blue-400/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200 shadow-2xl shadow-cyan-950/40">
          <Construction className="h-9 w-9" strokeWidth={1.6} />
        </div>

        <p className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          Coming soon
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-slate-300 md:text-lg">
          {description}
        </p>

        <Link
          to="/dashboard"
          className="mt-9 inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}

export default UnderDevelopment;