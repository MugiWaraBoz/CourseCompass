import { Link } from "react-router-dom";

export default function AuthCard({ title, text, children, footer }) {
  return <section className="bg-[#fbfdfb] px-4 py-14 sm:px-6"><div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,.08)] sm:p-9"><Link to="/" className="text-sm font-semibold text-emerald-700">CourseCompass</Link><h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p><div className="mt-7">{children}</div>{footer && <div className="mt-7 border-t pt-5 text-center text-sm text-slate-500">{footer}</div>}</div></section>;
}
