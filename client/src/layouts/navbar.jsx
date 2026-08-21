function Navbar() {
  return (
    <nav className="border-b border-cyan-400/20 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-bold text-slate-950 shadow-md shadow-cyan-500/30">
            C
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">CourseCompass</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200">Admin</p>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <a href="/" className="transition hover:text-cyan-300">Home</a>
          <a href="/dashboard" className="transition hover:text-cyan-300">Dashboard</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
