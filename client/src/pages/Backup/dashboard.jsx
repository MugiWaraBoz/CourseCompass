function Dashboard() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Overview
        </p>
        <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
          CourseCompass Dashboard
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total courses', value: '148' },
          { label: 'Faculty members', value: '36' },
          { label: 'Active students', value: '2,940' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg shadow-slate-950/20"
          >
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
