import { ArrowUpRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Rating from "@/components/common/Rating";

export default function CourseCard({ course }) {
  return <Link to={`/courses/${course._id}`} className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"><div className="flex items-start justify-between"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{course.code}</span><ArrowUpRight className="size-5 text-slate-300 transition group-hover:text-emerald-600"/></div><h3 className="mt-5 min-h-14 text-xl font-semibold tracking-tight text-slate-950">{course.name}</h3><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="flex items-center gap-2 text-sm text-slate-500"><BookOpen className="size-4"/>{course.credit} credits · {course.department}</span><Rating value={course.avgRating} count={course.reviewCount} compact/></div></Link>;
}
