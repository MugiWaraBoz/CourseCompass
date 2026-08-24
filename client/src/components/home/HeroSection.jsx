// HeroSection.jsx - The main hero/banner area at the top of the homepage
// Displays headline, call-to-action buttons, live stats, and a feature carousel
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { getCourses } from "@/api/courseApi";
import { getFaculty } from "@/api/facultyApi";

// Highlight stats shown below the CTA buttons
const highlights = [
  { icon: BookOpen, key: "courses", label: "Courses" },
  { icon: Users, key: "faculty", label: "Faculty" },
];

// Carousel slides - each describes a platform feature with icon, text, and details
const featureSlides = [
  {
    icon: Search,
    eyebrow: "Course discovery",
    title: "Find the right course",
    description: "Browse the course directory and quickly understand what each course offers.",
    details: ["Course codes", "Credit hours", "Key topics", "Prerequisites"],
    statLabel: "Courses to explore",
    statKey: "courses",
  },
  {
    icon: GraduationCap,
    eyebrow: "Faculty directory",
    title: "Know your faculty",
    description: "Explore faculty profiles, teaching areas, and the courses connected to them.",
    details: ["Faculty profiles", "Teaching areas", "Courses taught", "Department info"],
    statLabel: "Faculty profiles",
    statKey: "faculty",
  },
  {
    icon: Sparkles,
    eyebrow: "One clear platform",
    title: "Decide with confidence",
    description: "Bring course and faculty information together before planning your semester.",
    details: ["Simple search", "Useful filters", "Clear details", "Easy comparison"],
    statLabel: "Built for students",
    statKey: null,
  },
];

function HeroSection() {
  // Track which carousel slide is currently visible (index into featureSlides)
  const [activeSlide, setActiveSlide] = useState(0);
  // Store fetched counts for courses and faculty (null until loaded)
  const [stats, setStats] = useState({ courses: null, faculty: null });

  // useEffect with empty deps [] runs once on mount to fetch stats from the API
  useEffect(() => {
    // "active" flag prevents state updates if component unmounts before response
    let active = true;

    // Fetch both course and faculty counts in parallel
    Promise.all([
      getCourses({ page: 1, limit: 1 }),
      getFaculty({ page: 1, limit: 1 }),
    ])
      .then(([courseResponse, facultyResponse]) => {
        if (!active) return;
        setStats({
          courses: courseResponse?.data?.pagination?.total ?? null,
          faculty: facultyResponse?.data?.pagination?.total ?? null,
        });
      })
      .catch(() => {
        if (active) setStats({ courses: null, faculty: null });
      });

    // Cleanup: mark component as inactive so stale responses are ignored
    return () => {
      active = false;
    };
  }, []);

  // Auto-advance carousel every 4.5 seconds using setInterval
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % featureSlides.length);
    }, 4500);

    // Cleanup: clear interval when component unmounts to prevent memory leaks
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#fbfdfb]">
      {/* Decorative blurred background circles */}
      <div
        aria-hidden="true"
        className="absolute -left-32 top-20 -z-10 size-80 rounded-full bg-emerald-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-20 -z-10 size-96 rounded-full bg-lime-100/60 blur-3xl"
      />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] min-w-0 max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
        {/* Left column: headline, description, CTA buttons, and live stats */}
        <div className="min-w-0 max-w-2xl text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-800 shadow-sm">
            <Search className="size-4" aria-hidden="true" />
            Built to make course selection easier
          </div>

          <h1 className="max-w-full break-words text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Choose courses with
            <span className="block text-emerald-700">confidence.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg lg:mx-0">
            Explore courses, learn about faculty, and make better academic
            decisions—all in one place.
          </p>

          {/* Primary and secondary call-to-action buttons */}
          <div className="mt-8 flex min-w-0 flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/courses"
              className="inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 px-6 text-base font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg sm:w-auto"
            >
              Explore Courses
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href="#faculty"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-slate-300 bg-white/70 px-6 text-base font-medium text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 sm:w-auto"
            >
              Meet the Faculty
            </a>
          </div>

          {/* Live stats - values come from API, show "-" while loading */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8 lg:justify-start">
            {highlights.map(({ icon: Icon, key, label }) => (
              <div key={label} className="flex items-center gap-3 text-left">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <strong className="block text-lg font-semibold text-slate-900">
                    {stats[key] ?? "-"}
                  </strong>
                  <span className="text-sm text-slate-500">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: feature carousel */}
        <div className="relative mx-auto w-full min-w-0 max-w-lg">
          <div className="absolute inset-8 -z-10 rounded-[2.5rem] bg-emerald-200/60 blur-2xl" />
          <div
            className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/85 shadow-[0_24px_70px_rgba(15,23,42,0.14)] backdrop-blur"
            role="region"
            aria-roledescription="carousel"
            aria-label="Course Compass features"
          >
            {/* Slides container - translateX shifts to show the active slide */}
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
                            className="break-words rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
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
                          {feature.statKey ? (stats[feature.statKey] ?? "-") : "Explore"}
                        </p>
                      </div>
                      <BookOpen className="size-7 text-emerald-600" aria-hidden="true" />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Carousel dot indicators - click to jump to a specific slide */}
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
