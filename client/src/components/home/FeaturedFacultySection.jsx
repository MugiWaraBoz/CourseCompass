import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnonymousFacultyAvatar from "@/components/ui/AnonymousFacultyAvatar";

// This section introduces the faculty directory without highlighting any one person.
function FeaturedFacultySection() {
  return (
    <section id="faculty" className="overflow-hidden bg-[#f4f7f4] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-emerald-950 px-6 py-10 text-white shadow-[0_20px_55px_rgba(6,78,59,0.16)] sm:px-10 sm:py-12 lg:px-14">
          {/* Soft background shapes add depth without representing a real faculty member. */}
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-36 right-32 size-72 rounded-full bg-emerald-700/30 blur-2xl" aria-hidden="true" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            {/* Faculty directory heading and explanation. */}
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Users className="size-4" aria-hidden="true" />
                Faculty directory
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Find the faculty member you need
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-emerald-50/70 sm:text-lg">
                Browse every faculty profile, explore teaching areas, and see
                which courses are connected to each educator.
              </p>

              {/* This button is visual only for now; routing will be added later. */}
              <Button className="mt-8 h-12 rounded-full bg-white px-6 text-base text-emerald-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-emerald-100">
                View Faculty Directory
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>

            {/* Anonymous avatars represent the directory as a whole, not specific people. */}
            <div className="flex items-end justify-center pr-2 lg:justify-end">
              <div className="relative z-10 grid size-28 place-items-center rounded-full border-4 border-emerald-950 bg-emerald-100 p-3 text-emerald-800 shadow-xl sm:size-36">
                <AnonymousFacultyAvatar variant="woman" className="size-full" />
              </div>
              <div className="-ml-5 grid size-24 place-items-center rounded-full border-4 border-emerald-950 bg-slate-200 p-3 text-slate-800 shadow-xl sm:-ml-7 sm:size-32">
                <AnonymousFacultyAvatar variant="man" className="size-full" />
              </div>
              <div className="-ml-5 grid size-20 place-items-center rounded-full border-4 border-emerald-950 bg-amber-100 p-2 text-amber-800 shadow-xl sm:-ml-7 sm:size-28">
                <AnonymousFacultyAvatar variant="woman" className="size-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedFacultySection;
