/**
 * FacultyDetailsPage
 *
 * Displays a detailed profile for a single faculty member.  Sections include
 * basic info cards (department, designation, rating), a short biography,
 * an optional AI-generated review summary, and a paginated list of student
 * reviews that users can vote on.
 *
 * Route: /faculty/:facultyId
 */
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Quote,
  Star,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { voteReview } from "@/api/authApi";
import { getFacultyAiSummary } from "@/api/aiApi";
import { getCourseById } from "@/api/courseApi";
import { getFacultyById, getFacultyReviews } from "@/api/facultyApi";
import { useAuth } from "@/hooks/useAuth";
import AiCookingState from "@/components/ui/AiCookingState";

// ===== UTILITY FUNCTIONS =====

/**
 * Produce a dependable avatar when the backend does not provide profile photos.
 * Returns the first letter of each of the first two words in `name`, upper-cased.
 */
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Convert stored review timestamps into a compact, human-readable date string.
 * Uses the browser's Intl API for locale-aware formatting.
 */
function formatReviewDate(dateValue) {
  if (!dateValue) return "Date unavailable";

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

// Fetch course info for each review and return { courseId: courseObject }
async function fetchCoursesForReviews(reviews) {
  const courseIds = [...new Set(reviews.map((r) => r.courseId).filter(Boolean))];
  const results = await Promise.allSettled(
    courseIds.map(async (id) => {
      const response = await getCourseById(id);
      return [id, response?.data?.course];
    }),
  );
  return Object.fromEntries(
    results
      .filter((r) => r.status === "fulfilled" && r.value[1])
      .map((r) => r.value),
  );
}

// ===== MAIN COMPONENT =====

function FacultyDetailsPage() {
  // ===== STATE =====

  // Route parameter — the MongoDB `_id` of the faculty member, pulled from the URL.
  const { facultyId } = useParams();

  // Auth token supplied by the global AuthContext; needed for voting and AI summary.
  const { token } = useAuth();

  // Faculty profile data (null until loaded successfully).
  const [facultyMember, setFacultyMember] = useState(null);

  // UI status for the faculty profile fetch.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reviews load independently so a review error never hides the faculty profile.
  const [reviews, setReviews] = useState([]);

  // Current sort mode for the review list ("recent" | "rating" | "votes").
  const [reviewSort, setReviewSort] = useState("recent");

  // Loading / error states specific to the reviews section.
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");

  // Tracks which review is currently being voted on (used to disable both buttons).
  const [votingReviewId, setVotingReviewId] = useState(null);
  const [voteError, setVoteError] = useState("");

  // Maps courseId -> course object so each review can show the related course name.
  const [reviewCourseById, setReviewCourseById] = useState({});

  // AI-generated summary of all reviews for this faculty member.
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // ===== EFFECTS =====

  // Fetch the faculty profile whenever the URL parameter changes.
  // The `active` flag prevents state updates after the component unmounts.
  useEffect(() => {
    let active = true;

    getFacultyById(facultyId)
      .then(async (response) => {
        if (active) setFacultyMember(response?.data ?? null);
      })
      .catch(() => {
        if (active) setError("We could not load this faculty profile right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [facultyId]);

  // Fetch reviews (and their associated course names) whenever the faculty ID or
  // sort mode changes.  Each review references a courseId; we batch-resolve those
  // to show the course code and name alongside each review.
  useEffect(() => {
    let active = true;

    getFacultyReviews(facultyId, { sortBy: reviewSort })
      .then(async (response) => {
        if (!active) return;

        const loadedReviews = response?.data?.reviews ?? [];
        const approvedReviews = loadedReviews.filter((r) => r.isApproved);
        setReviews(approvedReviews);

        // Fetch course info for each review
        const courseMap = await fetchCoursesForReviews(loadedReviews);
        if (active) setReviewCourseById(courseMap);

        setReviewsError("");
      })
      .catch(() => {
        if (active) {
          setReviews([]);
          setReviewsError("Faculty reviews could not be loaded right now.");
        }
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [facultyId, reviewSort]);

  // ===== EVENT HANDLERS =====

  /** Responds to the sort <select> change — triggers a re-fetch of reviews. */
  function handleReviewSortChange(event) {
    setReviewsLoading(true);
    setReviewSort(event.target.value);
  }

  /**
   * Cast an upvote or downvote on a single review, then re-fetch the full
   * review list to pick up the new vote totals.  Requires a valid auth token.
   */
  async function handleVote(reviewId, voteType) {
    if (!token) {
      setVoteError("Please log in to vote on reviews.");
      return;
    }

    setVoteError("");
    setVotingReviewId(reviewId);
    try {
      await voteReview(token, reviewId, voteType);
      const response = await getFacultyReviews(facultyId, { sortBy: reviewSort });
      const loadedReviews = response?.data?.reviews ?? [];
      setReviews(loadedReviews);
      const courseMap = await fetchCoursesForReviews(loadedReviews);
      setReviewCourseById(courseMap);
    } catch (requestError) {
      setVoteError(
        requestError.response?.data?.error?.message ||
          "Your vote could not be recorded. Please try again.",
      );
    } finally {
      setVotingReviewId(null);
    }
  }

  /**
   * Request an AI-generated summary of all student reviews for this faculty
   * member.  Handles common API-key and quota errors with friendly messages.
   */
  async function handleAiSummary() {
    if (!token) {
      setAiError("Please log in to use the Gemini review summary.");
      return;
    }

    setAiError("");
    setAiLoading(true);
    try {
      const response = await getFacultyAiSummary(token, facultyId);
      setAiSummary(response?.data?.summary || "No summary was returned.");
    } catch (requestError) {
      const code = requestError.response?.data?.error?.code;
      if (code === "API_KEY_NOT_FOUND") setAiError("Configure your Gemini API key in your profile first.");
      else if (code === "NOT_ENOUGH_REVIEWS") setAiError("At least five reviews are needed to generate a summary.");
      else if (requestError.response?.status === 429) setAiError("Gemini request limit reached. Please try again later.");
      else setAiError("The faculty summary could not be generated right now.");
    } finally {
      setAiLoading(false);
    }
  }

  // ===== EARLY RETURNS =====

  // Skeleton placeholder shown while the profile is still loading.
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf9] px-4 py-16">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-10 h-64 rounded-3xl bg-slate-200" />
          <div className="mt-6 h-56 rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  // Missing records and network failures share one clear recovery view.
  if (error || !facultyMember) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#f8faf9] px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            Faculty profile unavailable
          </h1>
          <p className="mt-3 text-slate-600">
            {error || "This faculty member could not be found."}
          </p>
          <Link
            to="/faculty"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-emerald-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to faculty
          </Link>
        </div>
      </main>
    );
  }

  // Derived numeric rating used for conditional styling.
  const rating = Number(facultyMember.avgRating || 0);

  // ===== JSX =====

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Profile identity uses the same visual language as course details. */}
      <section className="border-b border-emerald-100 bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/faculty"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to faculty
          </Link>

          <div className="mt-10 flex flex-col gap-7 sm:flex-row sm:items-center">
            {/* Avatar with initials fallback when no profile photo exists. */}
            <span className="grid size-24 shrink-0 place-items-center rounded-3xl border border-white/10 bg-emerald-400/10 text-2xl font-bold text-emerald-300">
              {getInitials(facultyMember.name)}
            </span>
            <div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                {facultyMember.shortCode || "Faculty"}
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                {facultyMember.name}
              </h1>
              <p className="mt-4 text-lg text-slate-300">
                {facultyMember.designation}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* These cards summarize the structured metadata returned by the API. */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8 lg:py-14">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Building2 className="size-5 text-emerald-600" aria-hidden="true" />
          <p className="mt-5 text-sm font-medium text-slate-500">Department</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {facultyMember.department || "Not provided"}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <BriefcaseBusiness className="size-5 text-emerald-600" aria-hidden="true" />
          <p className="mt-5 text-sm font-medium text-slate-500">Designation</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {facultyMember.designation || "Not provided"}
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <Star
            className={`size-5 ${rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
            aria-hidden="true"
          />
          <p className="mt-5 text-sm font-medium text-slate-500">Rating</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {rating ? rating.toFixed(1) : "Not rated"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {facultyMember.reviewCount || 0} reviews
          </p>
        </article>
      </section>

      {/* Long biographies remain readable inside a constrained content column. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        {voteError && (
          <p role="alert" className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {voteError}
          </p>
        )}
        <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
          <span className="grid size-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Faculty profile
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            About {facultyMember.name}
          </h2>
          <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
            {facultyMember.about || "A faculty biography is not available yet."}
          </p>
        </article>

        {/* Optional server-side AI summary — only shown when the backend has one. */}
        {facultyMember.aiReviewSummary && (
          <article className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-7 sm:p-9">
            <Quote className="size-5 text-emerald-700" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-slate-950">
              Student feedback summary
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              {facultyMember.aiReviewSummary}
            </p>
          </article>
        )}
      </section>

      {/* Client-triggered AI summary (Gemini) — distinct from the server-side one above. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                <Sparkles className="size-4" aria-hidden="true" /> Gemini insight
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Faculty review summary</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Generate a neutral summary from the available student reviews.</p>
            </div>
            <button type="button" onClick={handleAiSummary} disabled={aiLoading} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-60">
              <Sparkles className="size-4" aria-hidden="true" /> {aiLoading ? "Generating..." : "Generate summary"}
            </button>
          </div>
          {aiLoading && <AiCookingState label="Gemini is preparing your faculty insight" />}
          {aiSummary && <p className="mt-5 rounded-2xl border border-white/70 bg-white/70 p-4 text-sm leading-7 text-slate-700">{aiSummary}</p>}
          {aiError && <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{aiError}</p>}
        </div>
      </section>

      {/* Public reviews are ready for real records while presenting a useful empty state today. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Section header + sort controls */}
        <div className="flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Student feedback
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Faculty reviews
            </h2>
          </div>

          <Link
            to={`/profile/write-review?facultyId=${facultyMember._id}`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-slate-950 px-5 text-center text-sm font-semibold text-white hover:bg-emerald-700 sm:w-auto"
          >
            Write a review
          </Link>

          {/* Sort dropdown — triggers handleReviewSortChange to re-fetch reviews. */}
          <label className="relative w-full sm:w-auto">
            <span className="sr-only">Sort faculty reviews</span>
            <select
              value={reviewSort}
              onChange={handleReviewSortChange}
              className="h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 sm:min-w-44"
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

        {/* Conditional rendering: loading skeleton, error, empty state, or review cards. */}
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
              No faculty reviews yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Student reviews will appear here after authenticated users submit them.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {/* Render one card per review with author info, rating, comment, and votes. */}
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Author avatar + metadata (name, semester, date) */}
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                      <UserRound className="size-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="flex min-w-0 flex-wrap items-center gap-1.5 break-words font-semibold text-slate-900">
                        {review.author?.name || "Anonymous"}
                        {review.verified && (
                          <BadgeCheck
                            className="size-4 text-emerald-600"
                            aria-label="Verified student"
                          />
                        )}
                      </p>
                      <p className="mt-0.5 break-words text-xs text-slate-500">
                        {review.semester || "Semester unavailable"} · {formatReviewDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Star rating display — fills stars up to the numeric rating. */}
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

                {/* Review body text */}
                <p className="mt-5 leading-7 text-slate-700">
                  {review.comment || "No written comment was provided."}
                </p>

                {/* Related course label (only shown if the course data was resolved). */}
                {reviewCourseById[review.courseId] && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">
                    Course: {reviewCourseById[review.courseId].code} — {reviewCourseById[review.courseId].name}
                  </p>
                )}

                {/* Difficulty rating + upvote / downvote buttons */}
                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>Difficulty: {review.difficultyRating ?? "Not rated"}/5</span>
                  <span className="inline-flex items-center gap-2">
                    <button type="button" onClick={() => handleVote(review._id, "upvote")} disabled={votingReviewId === review._id} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60" aria-label="Upvote review">
                      <ThumbsUp className="size-3.5" aria-hidden="true" /> {review.upvotes ?? 0}
                    </button>
                    <button type="button" onClick={() => handleVote(review._id, "downvote")} disabled={votingReviewId === review._id} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-red-300 hover:text-red-700 disabled:opacity-60" aria-label="Downvote review">
                      <ThumbsDown className="size-3.5" aria-hidden="true" /> {review.downvotes ?? 0}
                    </button>
                    <span>{review.votescore ?? 0} helpful</span>
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

export default FacultyDetailsPage;
