import {
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  IdCard,
  Mail,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Format registration dates without exposing raw database timestamps.
function formatJoinDate(dateValue) {
  if (!dateValue) return "Unavailable";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function StudentProfilePage() {
  const { student } = useAuth();

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      {/* Identity header is based only on sanitized session data. */}
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center">
          <span className="grid size-20 shrink-0 place-items-center rounded-3xl border border-white/10 bg-emerald-400/10 text-emerald-300">
            <UserRound className="size-8" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Student account
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {student.name}
            </h1>
            <p className="mt-3 text-slate-300">{student.email}</p>
          </div>
        </div>
      </section>

      {/* Verification status helps students understand their current account access. */}
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div
          className={`flex items-start gap-4 rounded-3xl border p-6 ${
            student.verified
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          {student.verified ? (
            <BadgeCheck className="mt-0.5 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
          ) : (
            <ShieldAlert className="mt-0.5 size-6 shrink-0 text-amber-700" aria-hidden="true" />
          )}
          <div>
            <h2 className="font-semibold text-slate-950">
              {student.verified ? "Verified student" : "Verification pending"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {student.verified
                ? "Your student identity has been verified."
                : "Your account is active but has not yet received a verified badge."}
            </p>
          </div>
        </div>
      </section>

      {/* Read-only fields are safe while the backend profile-update endpoint is reviewed. */}
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:px-8">
        <ProfileField icon={IdCard} label="Student ID" value={student.studentIdNumber} />
        <ProfileField icon={Mail} label="University email" value={student.email} />
        <ProfileField
          icon={GraduationCap}
          label="CGPA"
          value={student.cgpa ?? "Not provided"}
        />
        <ProfileField
          icon={CalendarDays}
          label="Member since"
          value={formatJoinDate(student.createdAt)}
        />
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-500 shadow-sm">
          Profile editing will become available after the backend update endpoint is corrected and tested.
        </div>
      </section>
    </main>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Icon className="size-5 text-emerald-700" aria-hidden="true" />
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-xl font-semibold text-slate-950">
        {value || "Not provided"}
      </p>
    </article>
  );
}

export default StudentProfilePage;
