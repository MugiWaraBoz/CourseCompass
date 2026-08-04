import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getCourses } from "@/api/catalogApi";
import { getErrorMessage, isEmptyResponse } from "@/api/client";
import CourseCard from "@/components/catalog/CourseCard";
import Pagination from "@/components/common/Pagination";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/common/PageState";
import { inputClass } from "@/components/common/FormFields";
import { departments } from "@/data/constants";
import { useDebounce } from "@/hooks/useDebounce";

export default function CoursesPage() {
  const [search, setSearch] = useState(""); const debounced = useDebounce(search);
  const [department, setDepartment] = useState(""); const [sort, setSort] = useState("code-asc"); const [page, setPage] = useState(1);
  const [result, setResult] = useState({ courses: [], pagination: {} }); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); const [sortBy, order] = sort.split("-"); try { const { data } = await getCourses({ search: debounced || undefined, department: department || undefined, sortBy, order, page, limit: 12 }); setResult(data.data); } catch (e) { if (isEmptyResponse(e)) setResult({ courses: [], pagination: { page: 1, totalPages: 1 } }); else setError(getErrorMessage(e)); } finally { setLoading(false); } }, [debounced, department, sort, page]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [debounced, department, sort]);
  return <section className="bg-[#fbfdfb] px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><span className="text-sm font-semibold text-emerald-700">Course directory</span><h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Explore your next course</h1><p className="mt-4 text-slate-600">Search the university catalog, compare ratings, and learn from student experiences.</p></div><div className="mt-10 grid gap-3 rounded-3xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_12rem_12rem]"><label className="relative"><Search className="absolute left-3 top-[1.35rem] size-4 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-10`} placeholder="Search by name or code..." aria-label="Search courses"/></label><select value={department} onChange={e => setDepartment(e.target.value)} className={inputClass} aria-label="Department"><option value="">All departments</option>{departments.map(x => <option key={x}>{x}</option>)}</select><select value={sort} onChange={e => setSort(e.target.value)} className={inputClass} aria-label="Sort courses"><option value="code-asc">Course code</option><option value="rating-desc">Highest rated</option><option value="name-asc">Name A–Z</option></select></div><div className="mt-8">{loading ? <SkeletonGrid/> : error ? <ErrorState message={error} onRetry={load}/> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{result.courses.length ? result.courses.map(c => <CourseCard key={c._id} course={c}/>) : <EmptyState title="No courses found"/>}</div>}<Pagination page={result.pagination?.page || page} totalPages={result.pagination?.totalPages || 1} onChange={setPage}/></div></div></section>;
}
