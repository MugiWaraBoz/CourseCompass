// This component displays the Featured Courses section on the homepage.
import { ArrowUpRight, BookOpen, Clock3, Star } from "lucide-react";
import { featuredCourses } from "@/data/featuredCourses";
import webTechnologiesImage from "@/assets/courses/web-technologies.png";
import dataStructuresImage from "@/assets/courses/data-structures.png";
import databaseSystemsImage from "@/assets/courses/database-systems.png";

const courseImages = [
  webTechnologiesImage,
  dataStructuresImage,
  databaseSystemsImage,
];

function FeaturedCoursesSection() {
  return (
    <section id="courses" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading and introduction. */}
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
          <div className="hidden items-center gap-2 text-sm font-medium text-emerald-700 md:flex">
            Browse the course catalog
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </div>
        </div>

        {/* One card is created for every course in featuredCourses.js. */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course, index) => (
            <article key={course.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]">
              <div className="relative h-40 overflow-hidden bg-slate-100">
                <img
                  src={courseImages[index]}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-5 rounded-full border border-white/30 bg-slate-950/45 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                  {course.code}
                </span>
                <span className="absolute bottom-4 right-5 text-xs font-medium text-white/90">
                  {course.department}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">{course.title}</h3>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 min-h-18 text-sm leading-6 text-slate-600">{course.description}</p>
                {/* Faculty-choice information can be added here later when data is available. */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    <strong className="font-semibold text-slate-700">{course.rating}</strong>
                    rating
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-4 text-emerald-600" aria-hidden="true" />
                    {course.credits} credits
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCoursesSection;
