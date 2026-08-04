// Summarizes the logged-in student's account and verification information.
import { BadgeCheck, BookOpenCheck, Mail, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileShell from "@/components/profile/ProfileShell";

export default function ProfilePage() {
  const { student } = useAuth();
  return (
    <ProfileShell
      title={`Hello, ${student?.name?.split(" ")[0] || "student"}`}
      text="Manage your account and contributions from here."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border bg-white p-7 shadow-sm md:col-span-2">
          <div className="flex flex-wrap items-center gap-5">
            <span className="grid size-16 place-items-center rounded-2xl bg-slate-950 text-xl font-semibold text-white">
              {student?.name
                ?.split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-950">
                  {student?.name}
                </h2>
                {student?.verified && (
                  <BadgeCheck className="size-5 text-emerald-600" />
                )}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Student ID: {student?.studentIdNumber || "Not provided"}
              </p>
            </div>
          </div>
        </article>
        <Info icon={Mail} label="University email" value={student?.email} />
        <Info
          icon={BookOpenCheck}
          label="CGPA"
          value={student?.cgpa ?? "Not added"}
        />
        <Info
          icon={UserRound}
          label="Verification"
          value={student?.verified ? "Verified student" : "Not verified"}
        />
      </div>
    </ProfileShell>
  );
}
function Info({ icon: Icon, label, value }) {
  return (
    <article className="rounded-3xl border bg-white p-6 shadow-sm">
      <Icon className="size-5 text-emerald-700" />
      <small className="mt-5 block text-slate-500">{label}</small>
      <strong className="mt-1 block break-all text-slate-900">{value}</strong>
    </article>
  );
}
