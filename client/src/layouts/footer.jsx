function Footer() {
  return (
    <footer className="border-t border-cyan-400/20 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-sm md:flex-row">
        <p className="text-slate-300">
          &copy; 2024 CourseCompass. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-cyan-300">
          <span>Plan smarter</span>
          <span className="h-1 w-1 rounded-full bg-cyan-400"></span>
          <span>Graduate faster</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
