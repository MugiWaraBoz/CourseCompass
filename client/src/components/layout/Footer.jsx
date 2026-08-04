import { Link } from "react-router-dom";
import logo from "@/assets/CourseCompass.png";

export default function Footer() {
  return <footer className="border-t border-slate-200 bg-slate-950 text-slate-300"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8"><div><div className="flex items-center gap-3"><img src={logo} className="h-12 w-10 object-cover object-center" alt=""/><span className="font-semibold text-white">Course <span className="text-emerald-400">Compass</span></span></div><p className="mt-4 max-w-md text-sm leading-6 text-slate-400">A student-built platform for exploring courses, learning about faculty, and sharing useful academic experiences.</p></div><div className="flex gap-8 md:justify-end">{[["Courses","/courses"],["Faculty","/faculty"],["About","/#about"]].map(([label,to]) => <Link key={label} to={to} className="text-sm hover:text-emerald-400">{label}</Link>)}</div></div><div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">CourseCompass · East Delta University project</div></footer>;
}
