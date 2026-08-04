// Displays a faculty profile and its protected student reviews.
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Building2, GraduationCap } from "lucide-react";
import { getFaculty, getFacultyReviews } from "@/api/catalogApi";
import { getErrorMessage } from "@/api/client";
import Rating from "@/components/common/Rating";
import { ErrorState, LoadingState } from "@/components/common/PageState";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export default function FacultyDetailPage() {
  const { id } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFaculty(id)
      .then(({ data }) => setFaculty(data.data))
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);
  const loadReviews = useCallback(
    (params) => getFacultyReviews(id, params),
    [id],
  );
  if (loading) return <LoadingState label="Loading faculty profile..." />;
  if (error) return <ErrorState message={error} />;
  return (
    <div className="bg-[#fbfdfb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/faculty"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="size-4" />
          Back to faculty
        </Link>
        <section className="mt-6 rounded-[2rem] border bg-white p-7 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="grid size-20 shrink-0 place-items-center rounded-3xl bg-slate-950 text-xl font-semibold text-white">
              {faculty.shortCode}
            </span>
            <div>
              <span className="text-sm font-semibold text-emerald-700">
                {faculty.department} faculty
              </span>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {faculty.name}
              </h1>
              <p className="mt-2 text-slate-500">{faculty.designation}</p>
              <div className="mt-4">
                <Rating value={faculty.avgRating} count={faculty.reviewCount} />
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Info
              icon={Building2}
              label="Department"
              value={faculty.department}
            />
            <Info
              icon={GraduationCap}
              label="Short code"
              value={faculty.shortCode}
            />
          </div>
          {faculty.about && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold">About</h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                {faculty.about}
              </p>
            </div>
          )}
          {faculty.aiReviewSummary && (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-5 text-sm leading-6 text-slate-700">
              <strong className="block text-emerald-800">
                Review overview
              </strong>
              {faculty.aiReviewSummary}
            </div>
          )}
        </section>
        <div className="mt-12">
          <ReviewsSection loadReviews={loadReviews} facultyId={id} />
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
