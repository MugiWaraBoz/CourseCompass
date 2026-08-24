// FeaturedCoursesSection.jsx - Displays the top-rated courses on the homepage
// Fetches 3 courses sorted by rating, shows loading/error/empty states, and links to full catalog
import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, Clock3, Star } from "lucide-react";
import webTechnologiesImage from "@/assets/courses/web-technologies.png";
import dataStructuresImage from "@/assets/courses/data-structures.png";
import databaseSystemsImage from "@/assets/courses/database-systems.png";
import { Link } from "react-router";
import { getCourses } from "@/api/courseApi";

// Static array of course card images - maps by index to the fetched courses
const courseImages = [
  webTechnologiesImage,
  dataStructuresImage,
  databaseSystemsImage,
];

function FeaturedCoursesSection() {
  // Store the fetched courses array (empty until loaded)
  const [courses, setCourses] = useState([]);
  // Track fetch status: "loading" | "success" | "error"
  const [status, setStatus] = useState("loading");

  // useEffect with [] runs once on mount to fetch featured courses
  useEffect(() => {
    // "active" flag prevents setting state on an unmounted component
    let active = true;

    getCourses({ page: 1, limit: 3, sortBy: "avgRating", order: "desc" })
      .then((response) => {
        if (!active) return;
        setCourses(response?.data?.courses ?? []);
        setStatus("success");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    // Cleanup function runs when component unmounts
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="courses" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header with title and "Browse" link */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <BookOpen className="size-4" aria-hidden="true" />
              Featured courses
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Start exploring what you can learn
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Get a quick look at popular courses, student ratings, and the
              faculty members students choose most often.
            </p>
          </div>
          <Link to="/courses" className="hidden items-center gap-2 text-sm font-medium text-emerald-700 md:flex">
            Browse the course catalog
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Loading state: animated skeleton placeholders */}
        {status === "loading" && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        )}

        {/* Error state: friendly error message */}
        {status === "error" && (
          <p role="alert" className="mt-12 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Featured courses could not be loaded right now.
          </p>
        )}

        {/* Empty state: no courses exist yet */}
        {status === "success" && courses.length === 0 && (
          <p className="mt-12 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500">
            No courses are available yet.
          </p>
        )}

        {/* Success state: render course cards in a responsive grid */}
        {status === "success" && courses.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => (
            <Link key={course._id} to={`/courses/${course._id}`} className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
              {/* Course card image area with overlay */}
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={courseImages[index]}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-5 rounded-full border border-white/30 bg-slate-950/45 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                  {course.code || "Course"}
                </span>
                <span className="absolute bottom-4 right-5 text-xs font-medium text-white/90">
                  {course.department}
                </span>
              </div>

              {/* Course card body: title, description, rating, and credits */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{course.name}</h3>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">{course.description || `${course.department || "University"} course with ${course.credit ?? "available"} credits.`}</p>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Star className={`size-4 ${course.avgRating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} aria-hidden="true" />
                    <strong className="font-semibold text-slate-700">{course.avgRating ? Number(course.avgRating).toFixed(1) : "Not rated"}</strong>
                    rating
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-4 text-emerald-600" aria-hidden="true" />
                    {course.credit ?? "-"} credits
                  </span>
                </div>
              </div>
            </Link>
          ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedCoursesSection;
