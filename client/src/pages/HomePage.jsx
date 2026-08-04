// Builds the landing page from live catalog previews and informational sections.
import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, Search, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/home/HeroSection";
import CourseCard from "@/components/catalog/CourseCard";
import FacultyCard from "@/components/catalog/FacultyCard";
import { getCourses, getFaculties } from "@/api/catalogApi";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  useEffect(() => {
    Promise.all([
      getCourses({ limit: 3, sortBy: "rating", order: "desc" }),
      getFaculties({ limit: 3, sortBy: "rating", order: "desc" }),
    ])
      .then(([c, f]) => {
        setCourses(c.data.data.courses);
        setFaculty(f.data.data.faculty);
      })
      .catch(() => {});
  }, []);
  return (
    <>
      <HeroSection />
      <Preview
        eyebrow="Popular courses"
        title="Start with courses students are exploring"
        to="/courses"
        link="View all courses"
      >
        {courses.map((c) => (
          <CourseCard key={c._id} course={c} />
        ))}
      </Preview>
      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-emerald-400">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              A clearer way to plan your semester
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <Step
              icon={Search}
              number="01"
              title="Discover"
              text="Search courses and faculty using names, codes, departments, and ratings."
            />
            <Step
              icon={Star}
              number="02"
              title="Learn"
              text="Read student experiences about teaching, workload, and course difficulty."
            />
            <Step
              icon={BookOpenCheck}
              number="03"
              title="Contribute"
              text="Share your own review and help the next student make a confident choice."
            />
          </div>
        </div>
      </section>
      <Preview
        eyebrow="Meet the faculty"
        title="Learn about the people behind the courses"
        to="/faculty"
        link="Browse faculty"
      >
        {faculty.map((f) => (
          <FacultyCard key={f._id} faculty={f} />
        ))}
      </Preview>
      <section id="about" className="bg-emerald-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-semibold text-emerald-700">
              About CourseCompass
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built by students, for students.
            </h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-600">
              CourseCompass brings course information, faculty profiles, and
              student feedback into one simple place. It is designed to make
              academic choices less confusing and more informed.
            </p>
            <Link
              to="/auth/register"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Join the community <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Stat icon={BookOpenCheck} value="120+" label="Courses" />
            <Stat icon={Users} value="45+" label="Faculty profiles" />
          </div>
        </div>
      </section>
    </>
  );
}

function Preview({ eyebrow, title, to, link, children }) {
  return (
    <section className="bg-[#fbfdfb] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-emerald-700">
              {eyebrow}
            </span>
            <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950">
              {title}
            </h2>
          </div>
          <Link
            to={to}
            className="flex items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            {link}
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      </div>
    </section>
  );
}
function Step({ icon: Icon, number, title, text }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-7">
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300">
          <Icon className="size-5" />
        </span>
        <span className="text-sm text-slate-500">{number}</span>
      </div>
      <h3 className="mt-6 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </article>
  );
}
function Stat({ icon: Icon, value, label }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm">
      <Icon className="size-7 text-emerald-700" />
      <strong className="mt-8 block text-3xl text-slate-950">{value}</strong>
      <span className="text-sm text-slate-500">{label}</span>
    </div>
  );
}
