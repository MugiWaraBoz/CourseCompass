import {
  BookOpenCheck,
  Check,
  Compass,
  SearchCheck,
  UsersRound,
} from "lucide-react";

// These are the main benefits CourseCompass is designed to offer students.
// Keeping them in one array makes the content easy to edit or replace later.
const platformFeatures = [
  {
    icon: SearchCheck,
    title: "Find information faster",
    description:
      "Search through course information without moving between scattered pages or documents.",
  },
  {
    icon: BookOpenCheck,
    title: "Understand each course",
    description:
      "See course codes, credits, descriptions, and related details in one clear place.",
  },
  {
    icon: UsersRound,
    title: "Connect courses and faculty",
    description:
      "Learn who teaches a subject and explore faculty interests alongside course information.",
  },
];

function PlatformBenefitsSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-[#fbfdfb] lg:grid-cols-[0.82fr_1.18fr]">
          {/* Left side: explains the main value of the platform. */}
          <div className="relative overflow-hidden border-b border-slate-200 bg-emerald-50 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <div className="pointer-events-none absolute -bottom-24 -right-20 size-64 rounded-full border-[2.5rem] border-emerald-100" aria-hidden="true" />

            <div className="relative flex h-full flex-col">
              {/* A bold label makes the section name easy to notice at a glance. */}
              <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-emerald-800">
                <Compass className="size-4" aria-hidden="true" />
                Why Course Compass
              </div>

              <h2 className="mt-6 max-w-md text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Less searching. More confident decisions.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                CourseCompass brings the academic details students regularly
                need into one focused and easy to understand experience.
              </p>

              {/* Short summary of the practical value students receive. */}
              <div className="mt-10 space-y-4 border-t border-emerald-200 pt-7 lg:mt-auto">
                {["Clear academic information", "Simple course discovery", "Useful faculty context"].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="grid size-6 place-items-center rounded-full bg-emerald-700 text-white">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side: centered icon-and-text rows explain the platform's features. */}
          <div className="px-6 py-3 sm:px-10 lg:px-12">
            {platformFeatures.map(({ icon: Icon, title, description }) => (
              <article key={title} className="group grid gap-4 border-b border-slate-200 py-8 last:border-b-0 sm:grid-cols-[3rem_minmax(0,32rem)] sm:items-start sm:justify-center sm:gap-5">
                <span className="grid size-11 place-items-center rounded-2xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 sm:text-xl">{title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlatformBenefitsSection;
