import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Link } from "react-router";

// This is the final homepage prompt before the footer.
function FinalCtaSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-emerald-700 px-6 py-14 text-white shadow-[0_24px_70px_rgba(4,120,87,0.2)] sm:px-10 sm:py-16 lg:px-16">
          {/* Large background lettering gives the section character without adding content. */}
          <span className="pointer-events-none absolute -bottom-10 right-4 select-none text-[10rem] font-bold leading-none tracking-[-0.1em] text-white/[0.05] sm:text-[14rem]" aria-hidden="true">
            GO
          </span>
          <div className="pointer-events-none absolute -left-16 -top-20 size-64 rounded-full border-[2.5rem] border-white/[0.06]" aria-hidden="true" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            {/* Main message explains the next action a student can take. */}
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-emerald-200">
                Your next step
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to find the right direction?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/75 sm:text-lg">
                Start with the course directory or learn more about the faculty
                connected to the subjects you are considering.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link to="/courses" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-base text-emerald-800 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-emerald-50">
                <BookOpen aria-hidden="true" />
                Explore Courses
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/faculty" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-base text-white transition-all hover:-translate-y-0.5 hover:bg-white/20">
                <Users aria-hidden="true" />
                Browse Faculty
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
