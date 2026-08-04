import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getErrorMessage } from "@/api/client";
import { voteReview } from "@/api/reviewApi";
import { useAuth } from "@/context/AuthContext";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import Pagination from "@/components/common/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/PageState";
import { inputClass } from "@/components/common/FormFields";

export default function ReviewsSection({ loadReviews, courseId, facultyId }) {
  const { token } = useAuth(); const location = useLocation(); const [sortBy, setSortBy] = useState("recent"); const [page, setPage] = useState(1); const [result, setResult] = useState({ reviews: [], pagination: {} }); const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [writing, setWriting] = useState(false);
  const load = useCallback(async () => { if (!token) return; setLoading(true); setError(""); try { const { data } = await loadReviews({ sortBy, order: "desc", page, limit: 8 }); setResult(data.data); } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); } }, [token, loadReviews, sortBy, page]);
  useEffect(() => { load(); }, [load]);
  async function vote(id, voteType) { try { await voteReview(id, voteType); await load(); } catch (e) { setError(getErrorMessage(e)); } }
  if (!token) return <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-8 text-center"><h2 className="text-2xl font-semibold text-slate-950">Student reviews</h2><p className="mx-auto mt-3 max-w-xl text-slate-600">Sign in with your EDU account to read reviews, vote, and share your own experience.</p><Link to="/auth/login" state={{ from: location.pathname }} className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700">Sign in to continue</Link></section>;
  return <section><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-semibold text-slate-950">Student reviews</h2><p className="mt-1 text-sm text-slate-500">Honest experiences from the community.</p></div><div className="flex gap-3"><select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} className={`${inputClass} mt-0 h-10 w-36`}><option value="recent">Most recent</option><option value="votes">Most helpful</option><option value="rating">Highest rated</option></select><button onClick={() => setWriting(!writing)} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700">{writing ? "Close" : "Write a review"}</button></div></div>{writing && <div className="mt-6"><ReviewForm courseId={courseId} facultyId={facultyId} onSuccess={() => { setWriting(false); load(); }}/></div>}<div className="mt-7 space-y-4">{loading ? <LoadingState label="Loading reviews..."/> : error ? <ErrorState message={error} onRetry={load}/> : result.reviews.length ? result.reviews.map(r => <ReviewCard key={r._id} review={r} onVote={vote}/>) : <EmptyState title="No reviews yet" text="Be the first student to share an experience."/>}</div><Pagination page={result.pagination?.page || page} totalPages={result.pagination?.totalPages || 1} onChange={setPage}/></section>;
}
