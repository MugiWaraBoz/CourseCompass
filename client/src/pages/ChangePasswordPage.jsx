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

/**
 * ChangePasswordPage
 * Allows an authenticated user to change their password.
 * Requires the old password plus a new password entered twice for confirmation.
 */
function ChangePasswordPage() {
  // useAuth() provides auth context values like the JWT token
  const { token } = useAuth();

  // useState manages the form fields — each key maps to an input name
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Controls visibility of all password fields (show/hide toggle)
  const [showPasswords, setShowPasswords] = useState(false);

  // Tracks whether the form submission is in progress (disables button while true)
  const [submitting, setSubmitting] = useState(false);

  // Holds validation or server error messages displayed to the user
  const [error, setError] = useState("");

  // Holds a success message displayed after a successful password change
  const [successMessage, setSuccessMessage] = useState("");

  // Generic input handler — updates whichever field matches the input's name attribute
  function handleInputChange(event) {
    const { name, value } = event.target;
    // Uses the functional form of setState to safely update based on the previous state
    setFormData((current) => ({ ...current, [name]: value }));
  }

  // Handles form submission — performs validation then sends the API request
  async function handleSubmit(event) {
    // Prevent the browser's default full-page form submission behavior
    event.preventDefault();
    // Clear any previous messages before new validation/submission
    setError("");
    setSuccessMessage("");

    // Client-side validation: enforce minimum password length
    if (formData.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    // Client-side validation: ensure both password fields match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    // Show loading state on the submit button
    setSubmitting(true);

    try {
      // Call the API helper that sends the change-password request with the JWT token
      const response = await changePassword(token, formData);
      // Use the server message if available, otherwise show a default
      setSuccessMessage(response?.message || "Password changed successfully.");
      // Password inputs must be cleared immediately after a successful request.
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      // Extract the error message from the server response shape: { error: { message } }
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "Password change failed. Please try again.");
    } finally {
      // Always re-enable the submit button after the request finishes (success or failure)
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        {/* Back navigation link to the profile page */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to profile
        </Link>

        {/* Header icon — shows a success checkmark after password change, otherwise a key icon */}
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

        {/* The form's onSubmit triggers handleSubmit; native form validation is also active */}
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

          {/* Conditionally render error message — only shown when error is a non-empty string */}
          {error && (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </p>
          )}

          {/* Conditionally render success message — only shown when successMessage is a non-empty string */}
          {successMessage && (
            <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              {successMessage}
            </p>
          )}

          {/* Submit button — disabled and shows a loading label while submitting */}
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

/**
 * PasswordInput — A reusable labelled password field with a show/hide toggle button.
 * Uses the rest operator (...inputProps) to forward any extra props (name, value, onChange, etc.)
 * to the underlying <input> element, avoiding repetitive prop drilling.
 */
function PasswordInput({ label, showPasswords, onToggle, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative mt-2 block">
        {/* Decorative lock icon positioned inside the input field */}
        <LockKeyhole
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        {/* Switches between "text" and "password" type to toggle visibility */}
        <input
          {...inputProps}
          type={showPasswords ? "text" : "password"}
          required
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        {/* Eye toggle button — does not submit the form because type="button" */}
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
