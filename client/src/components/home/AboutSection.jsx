// AboutSection.jsx - Explains what CourseCompass is and what it offers
// Pure presentational component with a decorative compass graphic and feature list
import { BookOpen, Layers3, UserRoundCheck } from "lucide-react";

// About page feature points - each has an icon, title, and short description
const aboutPoints = [
  {
    icon: BookOpen,
    title: "Course information",
    description: "Important academic details presented in a consistent format.",
  },
  {
    icon: UserRoundCheck,
    title: "Faculty context",
    description: "Teaching areas and faculty profiles connected to relevant courses.",
  },
  {
    icon: Layers3,
    title: "One shared platform",
    description: "A single place designed to reduce scattered academic searching.",
  },
];

function AboutSection() {
  return (
    <section id="about" className="overflow-hidden bg-[#f7f5ef] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-8">
        {/* Decorative compass graphic built with CSS (no images) */}
        <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-emerald-900/20" />
          <div className="absolute inset-[12%] rounded-full border border-dashed border-emerald-900/25" />
          <div className="absolute inset-1/2 h-px w-[86%] -translate-x-1/2 bg-emerald-900/15" />
          <div className="absolute inset-1/2 h-[86%] w-px -translate-y-1/2 bg-emerald-900/15" />

          {/* Compass needle - two-color rotated rectangle */}
          <div className="absolute left-1/2 top-1/2 h-[52%] w-[26%] -translate-x-1/2 -translate-y-1/2 rotate-45">
            <div className="h-1/2 rounded-t-full bg-emerald-700" />
            <div className="h-1/2 rounded-b-full bg-emerald-200" />
          </div>
          <div className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-8 border-[#f7f5ef] bg-slate-950 text-sm font-bold tracking-widest text-white shadow-xl">
            CC
          </div>

          {/* Cardinal direction labels */}
          <span className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-bold text-emerald-900/50">N</span>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-900/50">S</span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-900/50">E</span>
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-900/50">W</span>
        </div>

        {/* Text content: heading, description, and feature list */}
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-emerald-700">
            About Course Compass
          </p>
          <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Built to make academic information easier to navigate
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            CourseCompass is a student-focused directory that brings course and
            faculty information together. Its purpose is simple: help students
            understand their options without searching through disconnected sources.
          </p>

          {/* Feature rows separated by borders */}
          <div className="mt-10 border-y border-slate-300">
            {aboutPoints.map(({ icon: Icon, title, description }) => (
              <div key={title} className="grid gap-4 border-b border-slate-300 py-5 last:border-b-0 sm:grid-cols-[3rem_0.7fr_1.3fr] sm:items-center">
                <span className="grid size-10 place-items-center rounded-full bg-white text-emerald-700 shadow-sm">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
