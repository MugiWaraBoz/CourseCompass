import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, PenLine, Star } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { createReview } from "@/api/authApi";
import { getCourseById, getCourses } from "@/api/courseApi";
import { getFaculty, getFacultyById } from "@/api/facultyApi";
import { useAuth } from "@/hooks/useAuth";

/**
 * WriteReviewPage
 *
 * A form page that lets authenticated students submit a course review.
 * If the URL contains query parameters (courseId / facultyId), the page
 * pre-selects those values and disables the search fields so the student
 * can only rate and comment on the specific course/faculty pair.
 *
 * React concepts used in this file:
 *  - useState   – local form / UI state
 *  - useEffect  – fetch pre-selected context on mount (URL params)
 *  - Controlled components – every input value is driven by state
 *  - Conditional rendering – loading skeleton, error / success banners
 *  - Component composition – SearchField & RatingField are reusable sub-components
 */

/* ───────── Default shape of the review form data ───────── */
const initialFormData = {
  courseId: "",
  facultyId: "",
  rating: "",
  difficultyRating: "",
  semester: "",
  comment: "",
  isAnonymous: false,
};

function WriteReviewPage() {
  // ──────── Auth & URL params ────────
  const { token } = useAuth(); // JWT used for the createReview request
  const [searchParams] = useSearchParams(); // read ?courseId=&facultyId= from URL

  // Values may be null if the param is missing
  const initialCourseId = searchParams.get("courseId") || "";
  const initialFacultyId = searchParams.get("facultyId") || "";

  // ──────── State ────────
  const [selectedCourse, setSelectedCourse] = useState(null); // full course object once fetched
  const [selectedFaculty, setSelectedFaculty] = useState(null); // full faculty object once fetched
  const [formData, setFormData] = useState(initialFormData); // all form inputs
  const [contextLoading, setContextLoading] = useState(true); // loading skeleton while fetching context
  const [contextError, setContextError] = useState(""); // error when pre-selected context fails to load
  const [submitting, setSubmitting] = useState(false); // disables form while POST request is in flight
  const [error, setError] = useState(""); // validation / server error shown below the form
  const [successMessage, setSuccessMessage] = useState(""); // shown after a successful submission

  // ──────── Effects ────────
  /**
   * On mount, if the URL had a courseId and/or facultyId, fetch the
   * corresponding course/faculty objects so we can display their names
   * and pre-fill the hidden form fields.
   *
   * The `active` flag is a standard React pattern to avoid calling
   * setState on an unmounted component (a memory leak).
   */
  useEffect(() => {
    let active = true; // becomes false on cleanup

    // Build an array of promises – one for each param that exists
    const contextRequests = [];
    if (initialCourseId) contextRequests.push(getCourseById(initialCourseId));
    if (initialFacultyId) contextRequests.push(getFacultyById(initialFacultyId));

    // Fire both requests in parallel; order is preserved by Promise.all
    Promise.all(contextRequests)
      .then((responses) => {
        if (!active) return; // component unmounted – bail out

        let responseIndex = 0;

        // If we requested a course, it is the first item in responses
        if (initialCourseId) {
          const course = responses[responseIndex++]?.data?.course;
          if (course) {
            setSelectedCourse(course);
            setFormData((current) => ({ ...current, courseId: course._id }));
          }
        }

        // If we requested faculty, it is the next item
        if (initialFacultyId) {
          const faculty = responses[responseIndex]?.data;
          if (faculty) {
            setSelectedFaculty(faculty);
            setFormData((current) => ({ ...current, facultyId: faculty._id }));
          }
        }
      })
      .catch(() => {
        if (active) setContextError("The selected review context could not be loaded.");
      })
      .finally(() => {
        if (active) setContextLoading(false); // stop skeleton regardless of success/failure
      });

    // Cleanup: mark the effect as inactive so pending promises don't update state
    return () => {
      active = false;
    };
  }, [initialCourseId, initialFacultyId]); // re-run only if URL params change

  // ──────── Event handlers ────────

  /**
   * Generic change handler for text inputs, textareas, and checkboxes.
   * Uses the input's `name` attribute as the state key so one handler
   * can serve every field in the form.
   */
  function handleInputChange(event) {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({
      ...current,
      // Checkboxes use `checked`; all other inputs use `value`
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /**
   * Form submit handler.
   * 1. Prevents the default page reload.
   * 2. Runs basic client-side validation.
   * 3. POSTs the review via createReview (authenticated).
   * 4. On success, shows a success banner and resets the form.
   * 5. On failure, surfaces the server message (or a generic one).
   */
  async function handleSubmit(event) {
    event.preventDefault(); // stop browser from reloading the page
    setError("");
    setSuccessMessage("");

    // ── Validation ──
    if (!formData.courseId || !formData.facultyId) {
      setError("Select both a course and faculty member.");
      return;
    }

    if (!formData.rating || !formData.difficultyRating || !formData.semester.trim()) {
      setError("Rating, difficulty, and semester are required.");
      return;
    }

    if (!formData.comment.trim()) {
      setError("Write a short review comment before submitting.");
      return;
    }

    setSubmitting(true); // lock the form while the request is in flight

    try {
      const response = await createReview(token, {
        ...formData,
        rating: Number(formData.rating), // convert string → number for the API
        difficultyRating: Number(formData.difficultyRating),
        semester: formData.semester.trim(),
        comment: formData.comment.trim(),
      });

      setSuccessMessage(response?.message || "Review posted successfully.");
      setFormData(initialFormData); // reset every field back to defaults
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "Review submission failed. Please try again.");
    } finally {
      setSubmitting(false); // unlock the form
    }
  }

  // ──────── Render ────────
  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        {/* ── Back link ── */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to profile
        </Link>

        {/* ── Page header ── */}
        <span className="mt-8 grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          {successMessage ? (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          ) : (
            <PenLine className="size-5" aria-hidden="true" />
          )}
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Student feedback
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Write a review
        </h1>
        <p className="mt-3 leading-7 text-slate-500">
          Your feedback helps students understand both the course and classroom experience.
        </p>

        {/* ── Loading skeleton shown while fetching pre-selected context ── */}
        {contextLoading ? (
          <div className="mt-8 space-y-5 animate-pulse">
            <div className="h-12 rounded-2xl bg-slate-100" />
            <div className="h-12 rounded-2xl bg-slate-100" />
            <div className="h-12 rounded-2xl bg-slate-100" />
          </div>
        ) : (
          /* ── Main review form ── */
          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            {/* Context-fetch error banner */}
            {contextError && (
              <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                {contextError}
              </p>
            )}

            {/* Course search field – can be locked if courseId was in the URL */}
            <SearchField
              label="Course"
              placeholder="Search by course code or name"
              selected={selectedCourse}
              selectedId={formData.courseId}
              contextLocked={Boolean(initialCourseId)}
              search={getCourses}
              getResults={(response) => response?.data?.courses ?? []}
              getLabel={(course) => `${course.code} — ${course.name}`}
              onSelect={(course) => {
                setSelectedCourse(course);
                setFormData((current) => ({
                  ...current,
                  courseId: course?._id || "",
                }));
              }}
              disabled={submitting}
            />

            {/* Faculty search field – can be locked if facultyId was in the URL */}
            <SearchField
              label="Faculty member"
              placeholder="Search by faculty name"
              selected={selectedFaculty}
              selectedId={formData.facultyId}
              contextLocked={Boolean(initialFacultyId)}
              search={getFaculty}
              getResults={(response) => response?.data?.faculty ?? []}
              getLabel={(member) => `${member.name} — ${member.department || "Faculty"}`}
              onSelect={(member) => {
                setSelectedFaculty(member);
                setFormData((current) => ({
                  ...current,
                  facultyId: member?._id || "",
                }));
              }}
              disabled={submitting}
            />

            {/* Rating drop-downs */}
            <RatingField
              label="Overall rating"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              disabled={submitting}
            />
            <RatingField
              label="Difficulty"
              name="difficultyRating"
              value={formData.difficultyRating}
              onChange={handleInputChange}
              disabled={submitting}
            />

            {/* Semester text input */}
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Semester</span>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                disabled={submitting}
                required
                placeholder="Example: Spring 2026"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
              />
            </label>

            {/* Review comment textarea */}
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">Your review</span>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                disabled={submitting}
                required
                rows="5"
                placeholder="Share what students should know about this course and faculty member."
                className="mt-2 w-full resize-y rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
              />
            </label>

            {/* Anonymous checkbox */}
            <label className="inline-flex items-center gap-3 text-sm text-slate-600 sm:col-span-2">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                disabled={submitting}
                className="size-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
              />
              Post this review anonymously
            </label>

            {/* Validation / server error */}
            {error && (
              <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:col-span-2">
                {error}
              </p>
            )}

            {/* Success message */}
            {successMessage && (
              <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800 sm:col-span-2">
                {successMessage}
              </p>
            )}

            {/* Submit button – disabled until both course & faculty are chosen */}
            <button
              type="submit"
              disabled={submitting || !formData.courseId || !formData.facultyId}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              <Star className="size-4" aria-hidden="true" />
              {submitting ? "Posting review..." : "Post review"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

/**
 * SearchField
 *
 * A reusable, debounced search-and-select component. The user types into
 * the input; after a 300ms pause, the `search` prop is called. Results
 * appear in a dropdown. Clicking a result calls `onSelect` with the full
 * object and clears the input.
 *
 * Props:
 *  - label         – label text above the field
 *  - placeholder   – input placeholder
 *  - selected      – the currently selected object (or null)
 *  - selectedId    – the _id of the selected item (used to show it as "locked")
 *  - contextLocked – when true the field is read-only (pre-selected via URL)
 *  - search        – async function to call with { search, page, limit }
 *  - getResults    – extracts the array of results from the API response
 *  - getLabel      – returns the display string for a result object
 *  - onSelect      – callback fired when the user picks a result
 *  - disabled      – disables input while submitting
 */
function SearchField({
  label,
  placeholder,
  selected,
  selectedId,
  contextLocked,
  search,
  getResults,
  getLabel,
  onSelect,
  disabled,
}) {
  // ──── Local state ────
  const [query, setQuery] = useState(""); // current text the user has typed
  const [results, setResults] = useState([]); // dropdown items from the last search
  const [searching, setSearching] = useState(false); // true while the API call is pending
  const [open, setOpen] = useState(false); // controls dropdown visibility

  // ──── Debounced search effect ────
  /**
   * Fires a search request 300 ms after the user stops typing.
   * Uses a cleanup function (`active` flag + clearTimeout) so that:
   *   - stale responses are ignored if the component unmounts
   *   - the timer is cancelled if the query changes before it fires
   */
  useEffect(() => {
    // If the field is locked or the query is too short, do nothing
    if (contextLocked || query.trim().length < 2) {
      return undefined;
    }

    let active = true; // safety flag to avoid setState after unmount

    const timer = window.setTimeout(() => {
      setSearching(true);
      search({ search: query.trim(), page: 1, limit: 8 })
        .then((response) => {
          if (active) setResults(getResults(response));
        })
        .catch(() => {
          if (active) setResults([]); // on error, show "no matches"
        })
        .finally(() => {
          if (active) setSearching(false);
        });
    }, 300); // 300 ms debounce

    return () => {
      active = false;
      window.clearTimeout(timer); // cancel the timer if query or deps change
    };
  }, [contextLocked, getResults, query, search]);

  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>

      {/* If the field is context-locked, show a read-only badge */}
      {contextLocked && selected ? (
        <span className="mt-2 flex min-h-12 items-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-medium text-emerald-900">
          {getLabel(selected)}
        </span>
      ) : (
        <span className="relative mt-2 block">
          {/* Search input */}
          <input
            value={selectedId && selected ? getLabel(selected) : query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
              if (selectedId) onSelect(null); // clear previous selection when typing
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            required={!selectedId}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
          />

          {/* Dropdown results – only visible when open & query is long enough */}
          {open && query.trim().length >= 2 && (
            <span className="absolute left-0 right-0 top-full z-10 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {searching ? (
                <span className="block px-3 py-3 text-sm text-slate-500">Searching...</span>
              ) : results.length === 0 ? (
                <span className="block px-3 py-3 text-sm text-slate-500">No matches found.</span>
              ) : (
                results.map((result) => (
                  <button
                    key={result._id}
                    type="button"
                    onClick={() => {
                      onSelect(result); // pass the full object back to the parent
                      setQuery(""); // clear the typed text
                      setOpen(false); // close the dropdown
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50"
                  >
                    {getLabel(result)}
                  </button>
                ))
              )}
            </span>
          )}
        </span>
      )}

      {/* Show the currently selected item name below the field (when not locked) */}
      {!contextLocked && selected && (
        <p className="mt-2 text-xs text-emerald-700">Selected: {getLabel(selected)}</p>
      )}
    </label>
  );
}

/**
 * RatingField
 *
 * A small wrapper around a native <select> that renders a 1-5 star rating
 * drop-down. Uses the spread operator (`...selectProps`) so the parent
 * can pass `name`, `value`, `onChange`, and `disabled` directly.
 *
 * Props:
 *  - label – text displayed above the select
 *  - ...selectProps – forwarded to the <select> element (name, value, onChange, disabled)
 */
function RatingField({ label, ...selectProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        {...selectProps}
        required
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
      >
        <option value="">Select rating</option>
        {[1, 2, 3, 4, 5].map((rating) => (
          <option key={rating} value={rating}>
            {rating} out of 5
          </option>
        ))}
      </select>
    </label>
  );
}

export default WriteReviewPage;
