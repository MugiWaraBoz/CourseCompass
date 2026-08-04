// Lists the current student's reviews and provides edit and delete actions.
import { useCallback, useEffect, useState } from "react";
import { deleteReview } from "@/api/reviewApi";
import { getMyReviews } from "@/api/studentApi";
import { getErrorMessage } from "@/api/client";
import ProfileShell from "@/components/profile/ProfileShell";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import Pagination from "@/components/common/Pagination";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/common/PageState";

export default function MyReviewsPage() {
  const [result, setResult] = useState({ reviews: [], pagination: {} });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMyReviews({ page, limit: 8 });
      setResult(data.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    load();
  }, [load]);
  async function remove(id) {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    try {
      await deleteReview(id);
      await load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }
  return (
    <ProfileShell
      title="My reviews"
      text="Edit or remove the experiences you have shared."
    >
      {editing && (
        <div className="mb-6">
          <ReviewForm
            initial={editing}
            onCancel={() => setEditing(null)}
            onSuccess={() => {
              setEditing(null);
              load();
            }}
          />
        </div>
      )}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="space-y-4">
          {result.reviews.length ? (
            result.reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                actions={
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(review)}
                      className="rounded-full border px-3 py-1.5 text-xs text-slate-600 hover:text-emerald-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(review._id)}
                      className="rounded-full border border-red-100 px-3 py-1.5 text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                }
              />
            ))
          ) : (
            <EmptyState
              title="You have not written any reviews"
              text="Visit a course or faculty profile to share an experience."
            />
          )}
        </div>
      )}
      <Pagination
        page={result.pagination?.page || page}
        totalPages={result.pagination?.totalPages || 1}
        onChange={setPage}
      />
    </ProfileShell>
  );
}
