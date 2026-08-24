import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, ChevronLeft, ChevronRight, Clock3, Search, SlidersHorizontal, Star } from "lucide-react";
import { Link } from "react-router";
import { getCourses } from "@/api/courseApi";

/**
 * COURSES PAGE
 * 
 * Displays a searchable, filterable, paginated list of courses.
 * Fetches data from the backend API with fallback to local preview data.
 */

// Number of courses per page (9 = 3 rows of 3 on large screens)
const PAGE_SIZE = 9;

// Fallback course data shown when backend is unavailable
const fallbackCourses = [
  { _id: "1", code: "CSE 221", name: "Data Structures", department: "CSE", credit: 3, avgRating: 4.7, reviewCount: 42 },
  { _id: "2", code: "CSE 242", name: "Web Technologies", department: "CSE", credit: 3, avgRating: 4.8, reviewCount: 36 },
  { _id: "3", code: "CSE 331", name: "Database Systems", department: "CSE", credit: 3, avgRating: 4.9, reviewCount: 51 },
  { _id: "4", code: "ENG 111", name: "Advanced Academic Reading & Writing", department: "ENG", credit: 3, avgRating: 4.4, reviewCount: 18 },
  { _id: "5", code: "MATH 120", name: "Calculus and Analytical Geometry", department: "MAT", credit: 3, avgRating: 4.3, reviewCount: 27 },
  { _id: "6", code: "PHY 107", name: "Physics I", department: "PHY", credit: 3, avgRating: 4.5, reviewCount: 24 },
];

// Department filter options derived from fallback data
const fallbackDepartments = [
  "All departments",
  ...new Set(fallbackCourses.map((course) => course.department)),
];

// Map UI sort options to backend API parameters
const sortOptions = {
  code: { sortBy: "code", order: "asc" },
  name: { sortBy: "name", order: "asc" },
  rating: { sortBy: "rating", order: "desc" },
};

// Get the course ID, handling both MongoDB ObjectId ($oid) and plain string formats
function getCourseId(course) {
  return course._id?.$oid ?? course._id;
}

/**
 * CourseCard - Displays a single course in the grid
 * Receives course object as prop and renders summary info
 */
function CourseCard({ course }) {
  const rating = Number(course.avgRating || 0);
  const courseId = getCourseId(course);

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
      <Link to={`/courses/${courseId}`} className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-700 transition-colors group-hover:text-emerald-700">
        View course details <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </article>
  );
}

function CoursesPage() {
  // ===== STATE =====
  
  // Course data from API
  const [courses, setCourses] = useState([]);
  // Department filter options (populated from API on mount)
  const [departments, setDepartments] = useState(fallbackDepartments);

  // User-controlled filters
  const [query, setQuery] = useState("");           // Search text
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced search text
  const [department, setDepartment] = useState("All departments");
  const [sort, setSort] = useState("code");
  const [page, setPage] = useState(1);

  // Pagination info from backend
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  // UI state
  const [loading, setLoading] = useState(true);       // Show skeleton loaders
  const [usingPreview, setUsingPreview] = useState(false); // Show fallback data notice

  // ===== EFFECTS =====

  // Debounce search input: wait 350ms after user stops typing before searching
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  // On mount: fetch all departments for the filter dropdown
  useEffect(() => {
    let active = true;
    getCourses({ page: 1, limit: 200, sortBy: "department", order: "asc" })
      .then((response) => {
        if (!active) return;
        const availableCourses = response?.data?.courses ?? [];
        setDepartments([
          "All departments",
          ...new Set(availableCourses.map((c) => c.department).filter(Boolean)),
        ]);
      })
      .catch(() => { if (active) setDepartments(fallbackDepartments); });
    return () => { active = false; };
  }, []);

  // Fetch courses when filters/pagination change
  useEffect(() => {
    let active = true;
    const selectedSort = sortOptions[sort];

    // Show loading state immediately when filters change
    setLoading(true);

    getCourses({
      page,
      limit: PAGE_SIZE,
      search: debouncedQuery || undefined,
      department: department === "All departments" ? undefined : department,
      ...selectedSort,
    })
      .then((response) => {
        if (!active) return;
        setCourses(response?.data?.courses ?? []);
        setPagination(response?.data?.pagination ?? { page, limit: PAGE_SIZE, total: 0, totalPages: 1 });
        setUsingPreview(false);
      })
      .catch((error) => {
        if (!active) return;
        // 404 = valid query with zero results (not an error)
        if (error.response?.status === 404) {
          setCourses([]);
          setPagination({ page: 1, limit: PAGE_SIZE, total: 0, totalPages: 1 });
          setUsingPreview(false);
          return;
        }
        // Network/server error: fall back to preview data
        setCourses(fallbackCourses);
        setPagination({ page: 1, limit: PAGE_SIZE, total: fallbackCourses.length, totalPages: 1 });
        setUsingPreview(true);
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [debouncedQuery, department, page, sort]);

  // ===== EVENT HANDLERS =====

  function handleQueryChange(event) {
    setLoading(true);
    setQuery(event.target.value);
    setPage(1); // Reset to first page on new search
  }

  function handleDepartmentChange(event) {
    setLoading(true);
    setDepartment(event.target.value);
    setPage(1);
  }

  function handleSortChange(event) {
    setLoading(true);
    setSort(event.target.value);
    setPage(1);
  }

  function changePage(nextPage) {
    setLoading(true);
    setPage(nextPage);
  }

  // Ensure at least page 1 is shown
  const totalPages = Math.max(pagination.totalPages || 1, 1);

  // ===== RENDER =====
  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-emerald-100 bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute -right-24 -top-40 size-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-emerald-300">
            <BookOpen className="size-4" /> Course catalog
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Find the right course for your next semester.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Search courses by name or code, compare student ratings, and explore the academic path that fits your goals.
          </p>
          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by course name or code..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-white pl-13 pr-5 text-slate-950 shadow-xl outline-none placeholder:text-slate-400 focus:ring-3 focus:ring-emerald-400/30"
            />
          </div>
        </div>
      </section>

      {/* Results section with filters, course grid, pagination */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Filter controls */}
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {loading ? "Loading courses..." : `${pagination.total} courses found`}
            </p>
            <p className="mt-1 text-sm text-slate-500">Browse and compare available courses.</p>
          </div>
          <div className="grid min-w-0 gap-3 sm:flex sm:flex-wrap">
            {/* Department filter */}
            <label className="relative min-w-0 sm:flex-1">
              <span className="sr-only">Department</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <select
                value={department}
                onChange={handleDepartmentChange}
                className="h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {departments.map((item) => <option key={item}>{item}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>
            {/* Sort filter */}
            <label className="relative min-w-0 sm:flex-1">
              <span className="sr-only">Sort courses</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="code">Course code</option>
                <option value="name">Course name</option>
                <option value="rating">Top rated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        {/* Preview data warning */}
        {usingPreview && (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Backend unavailable—showing preview course data.
          </p>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : courses.length ? (
          /* Course grid */
          <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={getCourseId(course) ?? course.code} course={course} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-24 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100">
              <Search className="size-6 text-slate-400" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-slate-950">No courses found</h2>
            <p className="mt-2 text-slate-500">Try another search term or department.</p>
            <button
              onClick={() => { setQuery(""); setDepartment("All departments"); setPage(1); }}
              className="mt-5 text-sm font-semibold text-emerald-700"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && !usingPreview && courses.length > 0 && totalPages > 1 && (
          <nav className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-8" aria-label="Course pagination">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" /> Previous
            </button>
            <span className="w-full text-center text-sm font-medium text-slate-600 sm:w-auto">Page {page} of {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => changePage(page + 1)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default CoursesPage;
