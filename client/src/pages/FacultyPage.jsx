import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";
import { getFaculty } from "@/api/facultyApi";
import { Link } from "react-router";

// Nine profiles create three balanced rows on large screens.
const PAGE_SIZE = 9;

// Translate UI sort values into parameters supported by the backend.
const sortOptions = {
  name: { sortBy: "name", order: "asc" },
  rating: { sortBy: "rating", order: "desc" },
};

// Create a compact, image-independent avatar from a faculty member's name.
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// Present one faculty summary returned by the directory endpoint.
function FacultyCard({ member }) {
  const rating = Number(member.avgRating || 0);

  return (
    <article className="group flex min-h-80 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-800">
          {getInitials(member.name)}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {member.department}
        </span>
      </div>

      <p className="mt-6 text-sm font-semibold text-emerald-700">
        {member.shortCode}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
        {member.name}
      </h2>
      <p className="mt-2 text-sm font-medium text-slate-500">
        {member.designation}
      </p>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
        {member.about || "Faculty biography is not available yet."}
      </p>

      <div className="mt-auto flex items-center gap-4 pt-6 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <Star
            className={`size-4 ${
              rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
            aria-hidden="true"
          />
          {rating ? rating.toFixed(1) : "Not rated"}
        </span>
        <span>{member.reviewCount || 0} reviews</span>
      </div>

      <Link
        to={`/faculty/${member._id}`}
        className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-semibold text-slate-700 transition-colors group-hover:text-emerald-700"
      >
        View faculty profile
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

function FacultyPage() {
  // API results and filter-option metadata.
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState(["All departments"]);
  const [designations, setDesignations] = useState(["All designations"]);

  // Search, filters, sorting, and pagination controlled by the user.
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [designation, setDesignation] = useState("All designations");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);

  // Pagination metadata is supplied by the backend response.
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  // Request status controls skeleton cards and the recoverable error state.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debouncing avoids sending one backend request per keystroke.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  // Load all real department and designation values for the filter menus.
  useEffect(() => {
    let active = true;

    getFaculty({ page: 1, limit: 100, sortBy: "name", order: "asc" })
      .then((response) => {
        if (!active) return;

        const availableFaculty = response?.data?.faculty ?? [];
        setDepartments([
          "All departments",
          ...new Set(
            availableFaculty.map((member) => member.department).filter(Boolean),
          ),
        ]);
        setDesignations([
          "All designations",
          ...new Set(
            availableFaculty.map((member) => member.designation).filter(Boolean),
          ),
        ]);
      })
      .catch(() => {
        // The primary request below displays the actionable error state.
      });

    return () => {
      active = false;
    };
  }, []);

  // The backend performs directory search, filtering, sorting, and pagination.
  useEffect(() => {
    let active = true;
    const selectedSort = sortOptions[sort];

    getFaculty({
      page,
      limit: PAGE_SIZE,
      search: debouncedQuery || undefined,
      department:
        department === "All departments" ? undefined : department,
      designation:
        designation === "All designations" ? undefined : designation,
      ...selectedSort,
    })
      .then((response) => {
        if (!active) return;

        setFaculty(response?.data?.faculty ?? []);
        setPagination(
          response?.data?.pagination ?? {
            page,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 1,
          },
        );
        setError("");
      })
      .catch((requestError) => {
        if (!active) return;

        // A 404 represents a valid filter combination with zero matches.
        if (requestError.response?.status === 404) {
          setFaculty([]);
          setPagination({
            page: 1,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 1,
          });
          setError("");
          return;
        }

        setFaculty([]);
        setError("Faculty profiles could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, department, designation, page, retryKey, sort]);

  function handleQueryChange(event) {
    setLoading(true);
    setQuery(event.target.value);
    setPage(1);
  }

  function handleDepartmentChange(event) {
    setLoading(true);
    setDepartment(event.target.value);
    setPage(1);
  }

  function handleDesignationChange(event) {
    setLoading(true);
    setDesignation(event.target.value);
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

  function retryRequest() {
    setLoading(true);
    setError("");
    setRetryKey((current) => current + 1);
  }

  function clearFilters() {
    setLoading(true);
    setQuery("");
    setDepartment("All departments");
    setDesignation("All designations");
    setPage(1);
  }

  // Always render at least page 1, including for an empty result.
  const totalPages = Math.max(pagination.totalPages || 1, 1);

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <section className="relative overflow-hidden border-b border-emerald-100 bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute -right-24 -top-40 size-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-emerald-300">
            <Users className="size-4" aria-hidden="true" />
            Faculty directory
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Learn more about your faculty.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Search real faculty profiles by name or shortcode and explore their
            academic background.
          </p>
          <div className="relative mt-8 max-w-2xl">
            <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={handleQueryChange}
              placeholder="Search by faculty name or shortcode..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-white pl-13 pr-5 text-slate-950 shadow-xl outline-none placeholder:text-slate-400 focus:ring-3 focus:ring-emerald-400/30"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-7 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {loading
                ? "Loading faculty..."
                : `${pagination.total} faculty members found`}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Browse and compare available faculty profiles.
            </p>
          </div>

          <div className="grid min-w-0 gap-3 sm:flex sm:flex-wrap">
            <label className="relative">
              <span className="sr-only">Department</span>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <select
                value={department}
                onChange={handleDepartmentChange}
                className="h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 sm:min-w-0"
              >
                {departments.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative">
              <span className="sr-only">Designation</span>
              <select
                value={designation}
                onChange={handleDesignationChange}
                className="h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 sm:min-w-0"
              >
                {designations.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative">
              <span className="sr-only">Sort faculty</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="h-11 w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 sm:min-w-0"
              >
                <option value="name">Faculty name</option>
                <option value="rating">Top rated</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        {error ? (
          <div className="py-24 text-center">
            <h2 className="text-xl font-semibold text-slate-950">
              Unable to load faculty
            </h2>
            <p className="mt-2 text-slate-500">{error}</p>
            <button
              type="button"
              onClick={retryRequest}
              className="mt-5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : faculty.length ? (
          <>
            <div className="grid gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
              {faculty.map((member) => (
                <FacultyCard key={member._id} member={member} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="flex flex-wrap items-center justify-center gap-3 border-t border-slate-200 pt-8"
                aria-label="Faculty pagination"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                  Previous
                </button>
                <span className="w-full text-center text-sm font-medium text-slate-600 sm:w-auto">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => changePage(page + 1)}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Search className="size-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-semibold text-slate-950">
              No faculty found
            </h2>
            <p className="mt-2 text-slate-500">
              Try another search term or filter combination.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-sm font-semibold text-emerald-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default FacultyPage;
