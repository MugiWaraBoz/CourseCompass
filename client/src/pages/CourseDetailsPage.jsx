import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  Clock3,
  Star,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router";
import {
  getCourseById,
  getCourseReviews,
  getCoursesByIds,
} from "@/api/courseApi";

// Convert an API timestamp into a readable date for review cards.
function formatReviewDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

function CourseDetailsPage() {
  // Read the selected MongoDB course ID from /courses/:courseId.
  const { courseId } = useParams();

  // Store the primary course, resolved prerequisites, and request status.
  const [course, setCourse] = useState(null);
  const [prerequisiteCourses, setPrerequisiteCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review state is independent so review failures never hide course details.
  const [reviews, setReviews] = useState([]);
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    let active = true;

    // Load the course first, then resolve its prerequisite IDs in parallel.
    getCourseById(courseId)
      .then(async (response) => {
        if (!active) return;

        const loadedCourse = response?.data?.course ?? null;
        setCourse(loadedCourse);

        const prerequisiteIds = loadedCourse?.prerequisiteId ?? [];
        if (prerequisiteIds.length > 0) {
          const loadedPrerequisites = await getCoursesByIds(prerequisiteIds);
          if (active) setPrerequisiteCourses(loadedPrerequisites);
        }
      })
      .catch(() => {
        if (active) setError("We could not load this course right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      // Prevent late API responses from updating an unmounted page.
      active = false;
    };
  }, [courseId]);

  // Load public course reviews separately from the primary course request.
  useEffect(() => {
    let active = true;

    getCourseReviews(courseId, { sortBy: reviewSort })
      .then((response) => {
        if (!active) return;

        setReviews(response?.data?.reviews ?? []);
        setReviewsError("");
      })
      .catch(() => {
        if (active) {
          setReviews([]);
          setReviewsError("Reviews could not be loaded right now.");
        }
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseId, reviewSort]);

  function handleReviewSortChange(event) {
    setReviewsLoading(true);
    setReviewSort(event.target.value);
  }

  // Keep the layout stable while course and prerequisite requests are loading.
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf9] px-4 py-16">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-10 h-48 rounded-3xl bg-slate-200" />
          <div className="mt-6 h-40 rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  // Display one recovery view for request failures and missing courses.
  if (error || !course) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#f8faf9] px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Course unavailable
          </h1>
          <p className="mt-3 text-slate-600">
            {error || "This course could not be found."}
          </p>
          <Link
            to="/courses"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to courses
          </Link>
        </div>
      </main>
    );
  }

  // Normalize optional API values before rendering them.
  const rating = Number(course.avgRating || 0);
  const prerequisiteCount = course.prerequisiteId?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Course identity and navigation back to the directory. */}
      <section className="border-b border-emerald-100 bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to courses
          </Link>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                {course.code}
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                {course.name}
              </h1>
              <p className="mt-4 text-lg text-slate-300">
                {course.department} Department
              </p>
            </div>

            <span className="grid size-16 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-emerald-300">
              <BookOpen className="size-7" aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>

      {/* At-a-glance metadata returned by GET /courses/:id. */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-14">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Clock3 className="size-5 text-emerald-600" aria-hidden="true" />
          <p className="mt-5 text-sm font-medium text-slate-500">Credits</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {course.credit}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Star
            className={`size-5 ${
              rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
            aria-hidden="true"
          />
          <p className="mt-5 text-sm font-medium text-slate-500">Rating</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {rating ? rating.toFixed(1) : "Not rated"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {course.reviewCount || 0} reviews
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <BookOpen className="size-5 text-emerald-600" aria-hidden="true" />
          <p className="mt-5 text-sm font-medium text-slate-500">
            Prerequisites
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">
            {prerequisiteCount || "None"}
          </p>
          {prerequisiteCount > 0 && (
            <p className="mt-1 text-sm text-slate-500">
              {prerequisiteCount === 1 ? "course required" : "courses required"}
            </p>
          )}
        </article>
      </section>

      {/* Resolved prerequisites link to their own detail pages. */}
      {prerequisiteCourses.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Required before this course
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Prerequisite courses
            </h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {prerequisiteCourses.map((prerequisite) => (
                <Link
                  key={prerequisite._id}
                  to={`/courses/${prerequisite._id}`}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 px-5 py-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <span>
                    <span className="block text-sm font-semibold text-emerald-700">
                      {prerequisite.code}
                    </span>
                    <span className="mt-1 block font-medium text-slate-900">
                      {prerequisite.name}
                    </span>
                  </span>
                  <BookOpen
                    className="size-5 text-slate-400 transition-colors group-hover:text-emerald-600"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews remain useful with an empty state before real records exist. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Student feedback
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Course reviews
            </h2>
          </div>

          <label className="relative">
            <span className="sr-only">Sort reviews</span>
            <select
              value={reviewSort}
              onChange={handleReviewSortChange}
              className="h-11 min-w-44 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="recent">Most recent</option>
              <option value="rating">Highest rated</option>
              <option value="votes">Most helpful</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </label>
        </div>

        {reviewsLoading ? (
          <div className="mt-8 grid gap-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : reviewsError ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
            {reviewsError}
          </div>
        ) : reviews.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-slate-950">
              No reviews yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Student reviews will appear here after they are submitted.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <UserRound className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                        {review.author?.name || "Anonymous"}
                        {review.verified && (
                          <BadgeCheck
                            className="size-4 text-emerald-600"
                            aria-label="Verified student"
                          />
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {review.semester || "Semester unavailable"} · {formatReviewDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`size-4 ${
                          index < Number(review.rating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-5 leading-7 text-slate-700">
                  {review.comment || "No written comment was provided."}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>Difficulty: {review.difficultyRating ?? "Not rated"}/5</span>
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="size-4" aria-hidden="true" />
                    {review.votescore ?? 0} helpful
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CourseDetailsPage;
