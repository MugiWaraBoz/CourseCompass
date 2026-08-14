import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  IdCard,
  Mail,
  Pencil,
  Save,
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
  const { student, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name || "",
    cgpa: student.cgpa ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function cancelEditing() {
    setFormData({ name: student.name || "", cgpa: student.cgpa ?? "" });
    setError("");
    setIsEditing(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (formData.cgpa !== "") {
      const cgpa = Number(formData.cgpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
        setError("CGPA must be between 0 and 4.");
        return;
      }
    }

    setSaving(true);

    try {
      const response = await updateProfile({
        name: formData.name.trim(),
        cgpa: formData.cgpa === "" ? null : Number(formData.cgpa),
      });

      setSuccessMessage(response?.data?.message || "Profile updated successfully.");
      setIsEditing(false);
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || requestError.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

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

      {/* Only backend-approved profile fields are editable in this form. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Account settings
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Personal information
              </h2>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage("");
                  setIsEditing(true);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit profile
              </button>
            )}
          </div>

          {successMessage && (
            <p role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </p>
          )}

          {isEditing && (
            <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Full name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">CGPA (optional)</span>
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  min="0"
                  max="4"
                  step="0.01"
                  placeholder="0.00 – 4.00"
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              {error && (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="h-11 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="size-4" aria-hidden="true" />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
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
