import { useEffect, useState } from "react";
import { ArrowRight, Star, Users } from "lucide-react";
import { Link } from "react-router";
import { getFaculty } from "@/api/facultyApi";

// This section introduces the faculty directory without highlighting any one person.
function FeaturedFacultySection() {
  const [faculty, setFaculty] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    getFaculty({ page: 1, limit: 3, sortBy: "avgRating", order: "desc" })
      .then((response) => {
        if (!active) return;
        setFaculty(response?.data?.faculty ?? []);
        setStatus("success");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

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

              <Link to="/faculty" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-base text-emerald-950 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-emerald-100">
                View Faculty Directory
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:w-full lg:max-w-[34rem]">
              {status === "loading" && [0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-white/10" />)}
              {status === "error" && <p role="alert" className="text-sm text-emerald-100/80 sm:col-span-3">Faculty data could not be loaded right now.</p>}
              {status === "success" && faculty.length === 0 && <p className="text-sm text-emerald-100/80 sm:col-span-3">No faculty profiles are available yet.</p>}
              {status === "success" && faculty.map((member) => (
                <Link key={member._id} to={`/faculty/${member._id}`} className="rounded-2xl border border-white/10 bg-white/10 p-4 transition-colors hover:bg-white/20">
                  <p className="font-semibold text-white">{member.name}</p>
                  <p className="mt-1 text-xs text-emerald-100/70">{member.department || member.designation || "Faculty"}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-amber-200"><Star className="size-3.5 fill-amber-300" aria-hidden="true" /> {member.avgRating ? Number(member.avgRating).toFixed(1) : "Not rated"}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedFacultySection;
