import { CheckCircle2, Search, SlidersHorizontal } from "lucide-react";

// These steps explain the simple journey a student follows on CourseCompass.
const journeySteps = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Start with a course, subject area, or faculty member you want to learn more about.",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Review",
    description:
      "Read the important details, check credits and ratings, and understand the available choices.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Decide",
    description:
      "Use the information you found to make a more confident academic decision.",
  },
];

function HowItWorksSection() {
  return (
    <section className="bg-slate-950 py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading introduces the three-step student journey. */}
        <div className="grid gap-6 border-b border-white/15 pb-9 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-emerald-400">
              How it works
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              From searching to deciding, without the confusion
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-400 lg:justify-self-end">
            CourseCompass keeps the process focused so students can move from a
            question to useful academic information in three clear steps.
          </p>
        </div>

        {/* Steps become a horizontal timeline on desktop and stack on smaller screens. */}
        <div className="relative mt-12 grid gap-8 lg:grid-cols-3 lg:gap-0">
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-8 hidden h-px bg-white/20 lg:block" aria-hidden="true" />

          {journeySteps.map(({ number, icon: Icon, title, description }, index) => (
            <article key={number} className={`relative grid grid-cols-[4rem_1fr] gap-5 lg:block ${index > 0 ? "lg:pl-10" : ""} ${index < journeySteps.length - 1 ? "lg:pr-10" : ""}`}>
              {/* The numbered circle shows the order of each step. */}
              <div className="relative z-10 grid size-16 place-items-center rounded-full border border-emerald-400/50 bg-slate-950 text-emerald-400 shadow-[0_0_0_8px_#020617]">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <div className="pt-1 lg:pt-8">
                <span className="text-xs font-bold tracking-[0.18em] text-emerald-400">
                  STEP {number}
                </span>
                <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400 sm:text-base">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
