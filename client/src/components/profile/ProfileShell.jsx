import { NavLink } from "react-router-dom";
import { FilePenLine, KeyRound, LayoutDashboard, MessageSquareText } from "lucide-react";

const links = [["Overview", "/profile", LayoutDashboard, true], ["Edit profile", "/profile/edit", FilePenLine], ["My reviews", "/profile/reviews", MessageSquareText], ["Change password", "/profile/password", KeyRound]];
export default function ProfileShell({ title, text, children }) {
  return <section className="bg-[#fbfdfb] px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[15rem_1fr]"><aside className="h-fit rounded-3xl border bg-white p-3 shadow-sm">{links.map(([label,to,Icon,end]) => <NavLink key={to} end={end} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:bg-slate-50"}`}><Icon className="size-4"/>{label}</NavLink>)}</aside><div><h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>{text && <p className="mt-2 text-slate-500">{text}</p>}<div className="mt-7">{children}</div></div></div></section>;
}
