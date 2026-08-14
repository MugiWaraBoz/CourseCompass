// This component displays the desktop and mobile navigation at the top of the site.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/CourseCompass.png";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Faculty", href: "/faculty" },
  { label: "About", href: "/#about" },
];

function Navbar() {
  // This value controls whether the mobile navigation menu is open or closed.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fbfdfb]/90 shadow-[0_1px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="Course Compass home"
        >
          <span className="relative h-14 w-11 shrink-0 overflow-hidden">
            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="absolute left-1/2 -top-2 h-[5.8rem] max-w-none -translate-x-1/2 transition-transform duration-300 group-hover:scale-105"
            />
          </span>

          <span className="flex flex-col leading-none">
            <span className="text-lg font-semibold tracking-tight text-slate-950">
              Course <span className="text-emerald-700">Compass</span>
            </span>
            <span className="mt-1.5 hidden text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
              Know Your Courses. Know Your Faculty.
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center rounded-full border border-slate-200/80 bg-white/70 p-1 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-emerald-50 hover:text-emerald-800 ${pathname === link.href ? "bg-emerald-50 text-emerald-800" : "text-slate-600"}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link to="/courses" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md">
            Explore Courses <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="relative size-4">
            <Menu
              aria-hidden="true"
              className={`absolute inset-0 transition-all duration-500 ${
                isMenuOpen
                  ? "rotate-90 scale-75 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              aria-hidden="true"
              className={`absolute inset-0 transition-all duration-500 ${
                isMenuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-75 opacity-0"
              }`}
            />
          </span>
        </Button>
      </nav>

      <div
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        style={{
          maxHeight: isMenuOpen ? "24rem" : "0rem",
          opacity: isMenuOpen ? 1 : 0,
          transition: "max-height 700ms ease-in-out, opacity 350ms ease-in-out",
        }}
        className={`overflow-hidden bg-[#fbfdfb]/95 md:hidden ${
          isMenuOpen
            ? "border-t border-slate-200/80 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
            : "pointer-events-none"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen
                ? "translateY(0) scale(1)"
                : "translateY(-2rem) scale(0.95)",
              transition: "opacity 450ms ease 100ms, transform 450ms ease 100ms",
            }}
            className="mx-auto my-5 max-w-md rounded-3xl border border-slate-200/80 bg-white/80 p-3 shadow-sm"
          >
            <div className="grid grid-cols-3 rounded-full border border-slate-200/80 bg-slate-50/80 p-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.label}
                  to={link.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                  style={{
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? "translateY(0)" : "translateY(-1rem)",
                    transition: `opacity 400ms ease ${220 + index * 110}ms, transform 400ms ease ${220 + index * 110}ms`,
                  }}
                  className="rounded-full px-2 py-2.5 text-center text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              to="/courses"
              tabIndex={isMenuOpen ? 0 : -1}
              style={{
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? "translateY(0)" : "translateY(-1rem)",
                transition: "opacity 450ms ease 550ms, transform 450ms ease 550ms",
              }}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 px-5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 hover:shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore Courses <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
