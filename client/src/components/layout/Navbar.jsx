// Navbar.jsx - Site-wide navigation header
// Shows logo, nav links, and auth controls (login/register or profile/logout)
// Uses responsive design: desktop nav always visible, mobile nav toggles open/close
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/CourseCompass.png";
import { ArrowRight, LogIn, LogOut, Menu, UserPlus, UserRound, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

// Static array of navigation links - easy to add/remove/reorder links here
const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Faculty", href: "/faculty" },
  { label: "About", href: "/#about" },
];

function Navbar() {
  // useState manages the mobile menu open/close state (boolean)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // useLocation gives us the current URL path to highlight the active link
  const { pathname } = useLocation();
  // useAuth provides the logged-in student info and auth functions from context
  const { student, isAuthenticated, signOut } = useAuth();

  // Extract first name for display; fallback to "Student" if not logged in
  const studentFirstName = student?.name?.split(" ")[0] || "Student";

  // Event handler: sign out the user and close the mobile menu
  function handleLogout() {
    signOut();
    setIsMenuOpen(false);
  }

  return (
    <header id="top" className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fbfdfb]/90 shadow-[0_1px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary navigation"
      >
        {/* Logo and site name - links to homepage */}
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

        {/* Desktop navigation - hidden on small screens */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Nav links pill container */}
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

          {/* Conditional rendering: show profile/logout if logged in, otherwise show login/register */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <Link
                to="/profile/write-review"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Write a Review <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 px-3 text-sm font-semibold text-slate-700 hover:text-emerald-700"
              >
                <UserRound className="size-4 text-emerald-700" aria-hidden="true" />
                {studentFirstName}
              </Link>
              {/* Logout button triggers handleLogout on click */}
              <button
                type="button"
                onClick={handleLogout}
                className="grid size-8 place-items-center rounded-full text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
              >
                <UserPlus className="size-4" aria-hidden="true" />
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger/X toggle button - only visible below lg breakpoint */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full lg:hidden"
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

      {/* Mobile navigation dropdown - animated open/close via inline styles */}
      <div
        id="mobile-navigation"
        aria-hidden={!isMenuOpen}
        style={{
          maxHeight: isMenuOpen ? "calc(100vh - 5rem)" : "0rem",
          opacity: isMenuOpen ? 1 : 0,
          transition: "max-height 700ms ease-in-out, opacity 350ms ease-in-out",
        }}
        className={`overflow-y-auto bg-[#fbfdfb]/95 lg:hidden ${
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
            {/* Mobile nav links in a 3-column grid */}
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

            {/* Mobile auth controls - same logic as desktop, different layout */}
            {isAuthenticated ? (
              <div className="mt-3 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <Link
                  to="/profile"
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-700 hover:text-emerald-700"
                >
                  <UserRound className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span className="truncate">Signed in as {studentFirstName}</span>
                </Link>
                <Link
                  to="/profile/write-review"
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Write a Review
                </Link>
                <button
                  type="button"
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={handleLogout}
                  className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-red-600"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
                >
                  <LogIn className="size-4" aria-hidden="true" />
                  Login
                </Link>
                <Link
                  to="/register"
                  tabIndex={isMenuOpen ? 0 : -1}
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  <UserPlus className="size-4" aria-hidden="true" />
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
