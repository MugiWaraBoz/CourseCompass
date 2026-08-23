import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router";
import { changePassword } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";

function ChangePasswordPage() {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await changePassword(token, formData);
      setSuccessMessage(response?.message || "Password changed successfully.");
      // Password inputs must be cleared immediately after a successful request.
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "Password change failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to profile
        </Link>

        <span className="mt-8 grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          {successMessage ? (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          ) : (
            <KeyRound className="size-5" aria-hidden="true" />
          )}
        </span>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Account security
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Change password
        </h1>
        <p className="mt-3 leading-7 text-slate-500">
          Confirm your current password, then choose a new password with at least eight characters.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <PasswordInput
            label="Current password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            showPasswords={showPasswords}
            onToggle={() => setShowPasswords((current) => !current)}
            autoComplete="current-password"
          />
          <PasswordInput
            label="New password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            showPasswords={showPasswords}
            onToggle={() => setShowPasswords((current) => !current)}
            autoComplete="new-password"
          />
          <PasswordInput
            label="Confirm new password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            showPasswords={showPasswords}
            onToggle={() => setShowPasswords((current) => !current)}
            autoComplete="new-password"
          />

          {error && (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </p>
          )}

          {successMessage && (
            <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Changing password..." : "Change password"}
            {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </form>
      </section>
    </main>
  );
}

function PasswordInput({ label, showPasswords, onToggle, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative mt-2 block">
        <LockKeyhole
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          {...inputProps}
          type={showPasswords ? "text" : "password"}
          required
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
        >
          {showPasswords ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </span>
    </label>
  );
}

export default ChangePasswordPage;
