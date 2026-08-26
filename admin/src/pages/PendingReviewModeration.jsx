import { useEffect, useState } from 'react';
import {
  approveReview,
  deleteReview,
  getAllPendingStudentReviews,
} from '@/api/reviewApi';
import { getStudentInfo } from '@/api/studentApi';
import { getCourseInfo } from '@/api/courseApi';
import { getFacultyInfo } from '@/api/facultyApi';

const displayId = (value) => {
  const id = value?.$oid || value?.toString?.() || value;
  return id ? String(id) : 'Unknown';
};

// Reviews come back with only raw ids for student/course/faculty. These helpers
// resolve those ids to display names via the individual info endpoints.
const ENTITY_FETCHERS = {
  student: getStudentInfo,
  course: getCourseInfo,
  faculty: getFacultyInfo,
};

function PendingReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entityInfo, setEntityInfo] = useState({
    student: {},
    course: {},
    faculty: {},
  });

  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllPendingStudentReviews();
        setReviews(response.data?.reviews ?? []);
      } catch (requestError) {
        // The API returns 404 when there are no pending reviews. For this page,
        // that is a valid empty state instead of an error.
        if (requestError.cause?.response?.status === 404) {
          setReviews([]);
        } else {
          setError(requestError.message || 'Unable to load pending reviews.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, []);

  // Resolve student/course/faculty ids to names, fetching each unique id once.
  useEffect(() => {
    if (reviews.length === 0) return;

    ['student', 'course', 'faculty'].forEach((kind) => {
      const idField = `${kind}Id`;
      const uniqueIds = Array.from(
        new Set(
          reviews
            .map((review) => review[idField])
            .filter(Boolean)
            .map((rawId) => displayId(rawId))
        )
      ).filter((id) => !(id in entityInfo[kind]));

      if (uniqueIds.length === 0) return;

      const fetcher = ENTITY_FETCHERS[kind];

      Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const response = await fetcher(id);
            const data = response.data?.[kind] ?? response.data;
            return [id, data ?? null];
          } catch {
            return [id, null];
          }
        })
      ).then((results) => {
        setEntityInfo((current) => ({
          ...current,
          [kind]: {
            ...current[kind],
            ...Object.fromEntries(results),
          },
        }));
      });
    });
  }, [reviews, entityInfo]);

  const removeReview = (reviewId) => {
    setReviews((currentReviews) =>
      currentReviews.filter((review) => review._id !== reviewId)
    );
    setExpandedReview(null);
  };

  const handleApprove = async (reviewId) => {
    try {
      setActionId(reviewId);
      setError(null);
      await approveReview(reviewId);
      removeReview(reviewId);
    } catch (requestError) {
      setError(requestError.message || 'Unable to approve review.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      setActionId(reviewId);
      setError(null);
      await deleteReview(reviewId);
      removeReview(reviewId);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reject review.');
    } finally {
      setActionId(null);
    }
  };

  const getName = (kind, rawId, populatedName) => {
    if (populatedName) return populatedName;
    const id = displayId(rawId);
    const info = entityInfo[kind][id];
    return info?.name || info?.code || id;
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredReviews = normalizedQuery
    ? reviews.filter((review) => {
        const haystack = [
          getName('student', review.studentId, review.student?.name),
          getName('faculty', review.facultyId, review.faculty?.name),
          getName(
            'course',
            review.courseId,
            review.course?.code || review.course?.name
          ),
          displayId(review._id),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
    : reviews;

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">
            Pending Review Moderation
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review submitted content before making it publicly visible.
            {!loading && reviews.length > 0 && (
              <span className="ml-1 text-slate-500">
                ({filteredReviews.length} of {reviews.length})
              </span>
            )}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by student, faculty, course, or review ID"
            className="w-full rounded-lg border border-cyan-400/15 bg-slate-900/60 px-4 py-2 text-sm text-cyan-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-cyan-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-center text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center text-slate-400">
          Loading pending reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-cyan-400/15 bg-slate-900/60 text-slate-400">
          No pending reviews.
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-cyan-400/15 bg-slate-900/60 text-slate-400">
          No reviews match "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => {
            const isExpanded = expandedReview === review._id;
            const isActing = actionId === review._id;

            return (
              <div
                key={review._id}
                className="overflow-hidden rounded-2xl border border-cyan-400/15 bg-slate-900/60 shadow-xl transition hover:border-cyan-400/30"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedReview((currentId) =>
                      currentId === review._id ? null : review._id
                    )
                  }
                  className="grid w-full cursor-pointer grid-cols-1 gap-4 p-4 text-left transition hover:bg-slate-800 sm:grid-cols-4"
                  aria-expanded={isExpanded}
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-500">
                      Student
                    </p>
                    <p className="mt-1 break-all font-semibold text-cyan-100">
                      {getName(
                        'student',
                        review.studentId,
                        review.student?.name
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-500">
                      Course
                    </p>
                    <p className="mt-1 font-semibold text-cyan-100">
                      {getName(
                        'course',
                        review.courseId,
                        review.course?.code || review.course?.name
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-500">
                      Rating
                    </p>
                    <p className="mt-1 font-semibold text-yellow-400">
                      {review.rating}/5
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-cyan-500">
                      Status
                    </p>
                    <p className="mt-1 font-semibold text-orange-400">
                      Pending
                    </p>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-cyan-400/10 p-5">
                    <dl className="mb-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-cyan-500">
                          Faculty
                        </dt>
                        <dd className="mt-1 break-all">
                          {getName(
                            'faculty',
                            review.facultyId,
                            review.faculty?.name
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-cyan-500">
                          Semester
                        </dt>
                        <dd className="mt-1">
                          {review.semester || 'Not provided'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs uppercase tracking-wider text-cyan-500">
                          Difficulty
                        </dt>
                        <dd className="mt-1">
                          {review.difficultyRating ?? 'Not provided'}/5
                        </dd>
                      </div>
                    </dl>

                    <div className="mb-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-500">
                        Review
                      </p>
                      <div className="rounded-xl bg-slate-950/60 p-4 text-slate-200">
                        {review.comment || 'No comment provided.'}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleReject(review._id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isActing ? 'Processing...' : 'Reject'}
                      </button>
                      <button
                        type="button"
                        disabled={isActing}
                        onClick={() => handleApprove(review._id)}
                        className="rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-2 font-semibold text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isActing ? 'Processing...' : 'Approve'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PendingReviewModeration;
