import { ArrowUp, BookOpen, Compass, Users } from "lucide-react";
import logo from "@/assets/CourseCompass.png";
import { Link } from "react-router";

// Footer links point to sections that already exist on the homepage.
// Full page routes can replace these links during the routing phase.
const footerLinks = [
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Faculty", href: "/#faculty", icon: Users },
  { label: "About", href: "/#about", icon: Compass },
];

function Footer() {
  // The year updates automatically instead of needing a manual change each year.
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer area contains the project identity and navigation. */}
        <div className="grid gap-12 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-start lg:py-16">
          <div className="max-w-xl">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Course Compass home">
              {/* The source file is wide, so this small window crops it around only the compass symbol. */}
              {/* Transparent background lets the compass symbol sit directly on the footer. */}
              <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl">
                <img
                  src={logo}
                  alt=""
                  aria-hidden="true"
                  className="absolute -top-2 left-1/2 h-[5.3rem] max-w-none -translate-x-1/2"
                />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                Course <span className="text-emerald-400">Compass</span>
              </span>
            </Link>

            <p className="mt-6 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
              A student-focused platform for exploring course information,
              understanding faculty expertise, and navigating academic choices.
            </p>
            <p className="mt-5 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Know your courses. Know your faculty.
            </p>
          </div>

          {/* Compact navigation keeps the important sections easy to find. */}
          <div className="md:justify-self-end">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
              Explore
            </p>
            <nav className="mt-5 grid gap-2 sm:grid-cols-3 md:grid-cols-1" aria-label="Footer navigation">
              {footerLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} className="group flex min-w-0 items-center justify-between gap-4 border-b border-white/10 py-3 text-sm text-slate-300 transition-colors hover:text-white">
                  <span className="flex items-center gap-3">
                    <Icon className="size-4 text-slate-500 transition-colors group-hover:text-emerald-400" aria-hidden="true" />
                    {label}
                  </span>
                  <span className="text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">→</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar holds legal text and a quick return-to-top control. */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} CourseCompass. Academic project.</p>
          <a href="#top" className="inline-flex w-fit items-center gap-2 font-medium text-slate-400 transition-colors hover:text-emerald-400">
            Back to top
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
