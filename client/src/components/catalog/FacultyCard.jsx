import { ArrowUpRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import Rating from "@/components/common/Rating";

export default function FacultyCard({ faculty }) {
  const initials = faculty.shortCode || faculty.name?.split(" ").map(x => x[0]).slice(0, 2).join("");
  return <Link to={`/faculty/${faculty._id}`} className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"><div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">{initials}</span><ArrowUpRight className="size-5 text-slate-300 transition group-hover:text-emerald-600"/></div><h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">{faculty.name}</h3><p className="mt-1 min-h-10 text-sm text-slate-500">{faculty.designation}</p><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="flex items-center gap-2 text-sm text-slate-500"><GraduationCap className="size-4"/>{faculty.department}</span><Rating value={faculty.avgRating} count={faculty.reviewCount} compact/></div></Link>;
}
