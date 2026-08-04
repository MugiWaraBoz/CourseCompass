import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getFaculties } from "@/api/catalogApi";
import { getErrorMessage, isEmptyResponse } from "@/api/client";
import FacultyCard from "@/components/catalog/FacultyCard";
import Pagination from "@/components/common/Pagination";
import { EmptyState, ErrorState, SkeletonGrid } from "@/components/common/PageState";
import { inputClass } from "@/components/common/FormFields";
import { departments } from "@/data/constants";
import { useDebounce } from "@/hooks/useDebounce";

export default function FacultyPage() {
  const [search, setSearch] = useState(""); const debounced = useDebounce(search); const [department, setDepartment] = useState(""); const [sort, setSort] = useState("name-asc"); const [page, setPage] = useState(1);
  const [result, setResult] = useState({ faculty: [], pagination: {} }); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); const [sortBy, order] = sort.split("-"); try { const { data } = await getFaculties({ search: debounced || undefined, department: department || undefined, sortBy, order, page, limit: 12 }); setResult(data.data); } catch (e) { if (isEmptyResponse(e)) setResult({ faculty: [], pagination: { page: 1, totalPages: 1 } }); else setError(getErrorMessage(e)); } finally { setLoading(false); } }, [debounced, department, sort, page]);
  useEffect(() => { load(); }, [load]); useEffect(() => setPage(1), [debounced, department, sort]);
  return <section className="bg-[#fbfdfb] px-4 py-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><span className="text-sm font-semibold text-emerald-700">Faculty directory</span><h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Know your faculty</h1><p className="mt-4 max-w-2xl text-slate-600">Explore teaching profiles and student feedback before your semester begins.</p><div className="mt-10 grid gap-3 rounded-3xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_12rem_12rem]"><label className="relative"><Search className="absolute left-3 top-[1.35rem] size-4 text-slate-400"/><input value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} pl-10`} placeholder="Search name or short code..."/></label><select value={department} onChange={e => setDepartment(e.target.value)} className={inputClass}><option value="">All departments</option>{departments.map(x => <option key={x}>{x}</option>)}</select><select value={sort} onChange={e => setSort(e.target.value)} className={inputClass}><option value="name-asc">Name A–Z</option><option value="rating-desc">Highest rated</option><option value="designation-asc">Designation</option></select></div><div className="mt-8">{loading ? <SkeletonGrid/> : error ? <ErrorState message={error} onRetry={load}/> : <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{result.faculty.length ? result.faculty.map(f => <FacultyCard key={f._id} faculty={f}/>) : <EmptyState title="No faculty found"/>}</div>}<Pagination page={result.pagination?.page || page} totalPages={result.pagination?.totalPages || 1} onChange={setPage}/></div></div></section>;
}
