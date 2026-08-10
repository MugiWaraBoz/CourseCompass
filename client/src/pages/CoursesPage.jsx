import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, Clock3, Search, SlidersHorizontal, Star } from "lucide-react";
import { getCourses } from "@/api/courseApi";

const fallbackCourses = [
  { _id: "1", code: "CSE 221", name: "Data Structures", department: "CSE", credit: 3, avgRating: 4.7, reviewCount: 42 },
  { _id: "2", code: "CSE 242", name: "Web Technologies", department: "CSE", credit: 3, avgRating: 4.8, reviewCount: 36 },
  { _id: "3", code: "CSE 331", name: "Database Systems", department: "CSE", credit: 3, avgRating: 4.9, reviewCount: 51 },
  { _id: "4", code: "ENG 111", name: "Advanced Academic Reading & Writing", department: "ENG", credit: 3, avgRating: 4.4, reviewCount: 18 },
  { _id: "5", code: "MAT 120", name: "Calculus and Analytical Geometry", department: "MAT", credit: 3, avgRating: 4.3, reviewCount: 27 },
  { _id: "6", code: "PHY 107", name: "Physics I", department: "PHY", credit: 3, avgRating: 4.5, reviewCount: 24 },
];

function CourseCard({ course }) {
  const rating = Number(course.avgRating || 0);
  return (
    <article className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-700">{course.code}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{course.department}</span>
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight text-slate-950">{course.name}</h2>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-8 text-sm text-slate-500">
        <span className="flex items-center gap-1.5"><Clock3 className="size-4 text-emerald-600" />{course.credit} credits</span>
        <span className="flex items-center gap-1.5"><Star className={`size-4 ${rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />{rating ? rating.toFixed(1) : "Not rated"}</span>
        {course.reviewCount > 0 && <span>{course.reviewCount} reviews</span>}
      </div>
      <button type="button" className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-700 transition-colors group-hover:text-emerald-700">
        View course details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </button>
    </article>
  );
}

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [sort, setSort] = useState("code");
  const [loading, setLoading] = useState(true);
  const [usingPreview, setUsingPreview] = useState(false);

  useEffect(() => {
    let active = true;
    getCourses().then((response) => {
      if (active) setCourses(response?.data?.courses ?? response?.courses ?? []);
    }).catch(() => {
      if (active) { setCourses(fallbackCourses); setUsingPreview(true); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const departments = useMemo(() => ["All departments", ...new Set(courses.map((course) => course.department).filter(Boolean))], [courses]);
  const visibleCourses = useMemo(() => {
    const search = query.trim().toLowerCase();
    return courses.filter((course) => department === "All departments" || course.department === department)
      .filter((course) => !search || `${course.code} ${course.name} ${course.department}`.toLowerCase().includes(search))
      .sort((a, b) => sort === "rating" ? Number(b.avgRating || 0) - Number(a.avgRating || 0) : sort === "name" ? a.name.localeCompare(b.name) : a.code.localeCompare(b.code));
  }, [courses, department, query, sort]);

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <section className="relative overflow-hidden border-b border-emerald-100 bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute -right-24 -top-40 size-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-emerald-300"><BookOpen className="size-4" />Course catalog</div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Find the right course for your next semester.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Search courses by name or code, compare student ratings, and explore the academic path that fits your goals.</p>
          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by course name or code..." className="h-14 w-full rounded-2xl border border-white/10 bg-white pl-13 pr-5 text-slate-950 shadow-xl outline-none placeholder:text-slate-400 focus:ring-3 focus:ring-emerald-400/30" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm font-semibold text-slate-950">{loading ? "Loading courses..." : `${visibleCourses.length} courses found`}</p><p className="mt-1 text-sm text-slate-500">Browse and compare available courses.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative"><span className="sr-only">Department</span><SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><select value={department} onChange={(event) => setDepartment(event.target.value)} className="h-11 min-w-48 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20">{departments.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /></label>
            <label className="relative"><span className="sr-only">Sort courses</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 min-w-40 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"><option value="code">Course code</option><option value="name">Course name</option><option value="rating">Top rated</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /></label>
          </div>
        </div>
        {usingPreview && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Backend unavailable—showing preview course data.</p>}
        {loading ? <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((item) => <div key={item} className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />)}</div> : visibleCourses.length ? <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">{visibleCourses.map((course) => <CourseCard key={course._id?.$oid ?? course._id ?? course.code} course={course} />)}</div> : <div className="py-24 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100"><Search className="size-6 text-slate-400" /></div><h2 className="mt-5 text-xl font-semibold text-slate-950">No courses found</h2><p className="mt-2 text-slate-500">Try another search term or department.</p><button onClick={() => { setQuery(""); setDepartment("All departments"); }} className="mt-5 text-sm font-semibold text-emerald-700">Clear filters</button></div>}
      </section>
    </main>
  );
}

export default CoursesPage;
