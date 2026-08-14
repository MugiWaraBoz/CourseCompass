import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Clock3, Star } from "lucide-react";
import { Link, useParams } from "react-router";
import { getCourseById } from "@/api/courseApi";

function CourseDetailsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getCourseById(courseId)
      .then((response) => {
        if (active) setCourse(response?.data?.course ?? null);
      })
      .catch(() => {
        if (active) setError("We could not load this course right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [courseId]);

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

  const rating = Number(course.avgRating || 0);
  const prerequisiteCount = course.prerequisiteId?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#f8faf9]">
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
    </main>
  );
}

export default CourseDetailsPage;
