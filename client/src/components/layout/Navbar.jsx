// Provides responsive primary navigation and session actions.
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, LogOut, Menu, UserRound, X } from "lucide-react";
import logo from "@/assets/CourseCompass.png";
import { useAuth } from "@/context/AuthContext";

const links = [
  ["Courses", "/courses"],
  ["Faculty", "/faculty"],
  ["About", "/#about"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"}`;
  function signOut() {
    logout();
    navigate("/");
    setOpen(false);
  }
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#fbfdfb]/90 shadow-[0_1px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative h-14 w-11 overflow-hidden">
            <img
              src={logo}
              alt=""
              className="absolute -top-2 left-1/2 h-[5.8rem] max-w-none -translate-x-1/2"
            />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-950">
            Course <span className="text-emerald-700">Compass</span>
            <small className="mt-1 block text-[.6rem] uppercase tracking-[.16em] text-slate-500">
              Know Your Courses. Know Your Faculty.
            </small>
          </span>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex rounded-full border bg-white/70 p-1">
            {links.map(([label, to]) => (
              <NavLink key={label} to={to} className={navClass}>
                {label}
              </NavLink>
            ))}
          </div>
          {student ? (
            <>
              <Link
                to="/profile"
                className="flex h-10 items-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <UserRound className="size-4" />
                {student.name?.split(" ")[0]}
              </Link>
              <button
                onClick={signOut}
                className="grid size-10 place-items-center rounded-full border bg-white text-slate-500 hover:text-red-600"
                aria-label="Log out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Sign in <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center rounded-full md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t bg-white p-4 md:hidden">
          <div className="mx-auto flex max-w-md flex-col gap-2">
            {links.map(([label, to]) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50"
              >
                {label}
              </NavLink>
            ))}
            {student ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="rounded-xl px-4 py-3 text-left text-sm text-red-600"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/auth/login"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
