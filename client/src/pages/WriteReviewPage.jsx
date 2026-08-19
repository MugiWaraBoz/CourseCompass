import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, PenLine, Star } from "lucide-react";
import { Link } from "react-router";
import { createReview } from "@/api/authApi";
import { getCourses } from "@/api/courseApi";
import { getFaculty } from "@/api/facultyApi";
import { useAuth } from "@/hooks/useAuth";

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
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let active = true;

    // Both selectors are loaded once so the submitted IDs match the API contract.
    Promise.all([
      getCourses({ page: 1, limit: 200, sortBy: "code", order: "asc" }),
      getFaculty({ page: 1, limit: 100, sortBy: "name", order: "asc" }),
    ])
      .then(([courseResponse, facultyResponse]) => {
        if (!active) return;

        setCourses(courseResponse?.data?.courses ?? []);
        setFaculty(facultyResponse?.data?.faculty ?? []);
      })
      .catch(() => {
        if (active) {
          setError("Course and faculty options could not be loaded right now.");
        }
      })
      .finally(() => {
        if (active) setLoadingOptions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleInputChange(event) {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

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

    setSubmitting(true);

    try {
      const response = await createReview(token, {
        ...formData,
        rating: Number(formData.rating),
        difficultyRating: Number(formData.difficultyRating),
        semester: formData.semester.trim(),
        comment: formData.comment.trim(),
      });

      setSuccessMessage(response?.message || "Review posted successfully.");
      setFormData(initialFormData);
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "Review submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to profile
        </Link>

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

        {loadingOptions ? (
          <div className="mt-8 space-y-5 animate-pulse">
            <div className="h-12 rounded-2xl bg-slate-100" />
            <div className="h-12 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
          </div>
        ) : (
          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <SelectField
              label="Course"
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              disabled={submitting || courses.length === 0}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.code} — {course.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Faculty member"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleInputChange}
              disabled={submitting || faculty.length === 0}
            >
              <option value="">Select faculty</option>
              {faculty.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} — {member.department}
                </option>
              ))}
            </SelectField>

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

            {error && (
              <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700 sm:col-span-2">
                {error}
              </p>
            )}

            {successMessage && (
              <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800 sm:col-span-2">
                {successMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || courses.length === 0 || faculty.length === 0}
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

function SelectField({ label, children, ...selectProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        {...selectProps}
        required
        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
      >
        {children}
      </select>
    </label>
  );
}

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
