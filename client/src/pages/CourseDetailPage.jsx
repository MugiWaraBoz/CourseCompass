// Displays public course information and its protected student reviews.
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Building2 } from "lucide-react";
import { getCourse, getCourseReviews } from "@/api/catalogApi";
import { getErrorMessage } from "@/api/client";
import Rating from "@/components/common/Rating";
import { ErrorState, LoadingState } from "@/components/common/PageState";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getCourse(id)
      .then(({ data }) => setCourse(data.data.course))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);
  const loadReviews = useCallback(
    (params) => getCourseReviews(id, params),
    [id],
  );
  if (loading) return <LoadingState label="Loading course..." />;
  if (error) return <ErrorState message={error} />;
  return (
    <div className="bg-[#fbfdfb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" />
          Back to courses
        </Link>
        <section className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-7 text-white sm:p-10">
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">
              {course.code}
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              {course.name}
            </h1>
            <div className="mt-6">
              <Rating value={course.avgRating} count={course.reviewCount} />
            </div>
          </div>
          <div className="grid gap-4 p-7 sm:grid-cols-3 sm:p-10">
            <Info
              icon={Building2}
              label="Department"
              value={course.department}
            />
            <Info icon={BookOpen} label="Credit hours" value={course.credit} />
            <Info
              icon={BookOpen}
              label="Prerequisites"
              value={
                course.prerequisiteId?.length
                  ? `${course.prerequisiteId.length} required`
                  : "None"
              }
            />
          </div>
          {course.aiReviewSummary && (
            <div className="mx-7 mb-7 rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-slate-700 sm:mx-10 sm:mb-10">
              <strong className="block text-emerald-800">
                Review overview
              </strong>
              {course.aiReviewSummary}
            </div>
          )}
        </section>
        <div className="mt-12">
          <ReviewsSection loadReviews={loadReviews} courseId={id} />
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <Icon className="size-5 text-emerald-700" />
      <small className="mt-3 block text-slate-500">{label}</small>
      <strong className="mt-1 block text-slate-900">{value}</strong>
    </div>
  );
}
