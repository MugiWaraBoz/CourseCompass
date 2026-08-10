// This component creates the large introduction area at the top of the homepage.
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: BookOpen, value: "120+", label: "Courses" },
  { icon: Users, value: "45+", label: "Faculty" },
];

const featureSlides = [
  {
    icon: Search,
    eyebrow: "Course discovery",
    title: "Find the right course",
    description: "Browse the course directory and quickly understand what each course offers.",
    details: ["Course codes", "Credit hours", "Key topics", "Prerequisites"],
    statLabel: "Courses to explore",
    statValue: "120+",
  },
  {
    icon: GraduationCap,
    eyebrow: "Faculty directory",
    title: "Know your faculty",
    description: "Explore faculty profiles, teaching areas, and the courses connected to them.",
    details: ["Faculty profiles", "Teaching areas", "Courses taught", "Department info"],
    statLabel: "Faculty profiles",
    statValue: "45+",
  },
  {
    icon: Sparkles,
    eyebrow: "One clear platform",
    title: "Decide with confidence",
    description: "Bring course and faculty information together before planning your semester.",
    details: ["Simple search", "Useful filters", "Clear details", "Easy comparison"],
    statLabel: "Built for students",
    statValue: "100%",
  },
];

function HeroSection() {
  // activeSlide remembers which feature card is currently visible.
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    // Automatically move the feature carousel every 4.5 seconds.
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % featureSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#fbfdfb]">
      <div
        aria-hidden="true"
        className="absolute -left-32 top-20 -z-10 size-80 rounded-full bg-emerald-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-20 -z-10 size-96 rounded-full bg-lime-100/60 blur-3xl"
      />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
            <Search className="size-4" aria-hidden="true" />
            Built to make course selection easier
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Choose courses with
            <span className="block text-emerald-700">confidence.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">
            Explore courses, learn about faculty, and make better academic
            decisions—all in one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button className="h-12 rounded-full bg-slate-900 px-6 text-base text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg">
              Explore Courses
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-full border-slate-300 bg-white/70 px-6 text-base text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Meet the Faculty
            </Button>
          </div>

          <div className="mt-10 flex justify-center gap-8 lg:justify-start">
            {highlights.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 text-left">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-lg font-semibold text-slate-900">
                    {value}
                  </strong>
                  <span className="text-sm text-slate-500">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-8 -z-10 rounded-[2.5rem] bg-emerald-200/60 blur-2xl" />
          <div
            className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur"
            role="region"
            aria-roledescription="carousel"
            aria-label="Course Compass features"
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {featureSlides.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="w-full shrink-0 p-5 sm:p-7"
                    aria-hidden={activeSlide !== index}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-emerald-700">
                          {feature.eyebrow}
                        </p>
                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                          {feature.title}
                        </h2>
                      </div>
                      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                    </div>

                    <p className="mt-4 min-h-12 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>

                    <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
                      <p className="text-sm text-slate-300">What you can discover</p>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {feature.details.map((detail) => (
                          <span
                            key={detail}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                          >
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
                          {feature.statLabel}
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-emerald-950">
                          {feature.statValue}
                        </p>
                      </div>
                      <BookOpen className="size-7 text-emerald-600" aria-hidden="true" />
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 border-t border-slate-100 px-5 py-4">
              {featureSlides.map((feature, index) => (
                <button
                  key={feature.title}
                  type="button"
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === index
                      ? "w-8 bg-emerald-600"
                      : "w-2 bg-slate-300 hover:bg-emerald-300"
                  }`}
                  aria-label={`Show ${feature.title}`}
                  aria-current={activeSlide === index ? "true" : undefined}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
