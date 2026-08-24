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
import { Link, useParams } from "react-router";
import { resetPassword } from "@/api/authApi";

/**
 * ResetPasswordPage
 * Displays the form a user reaches after clicking a password-reset email link.
 * The short-lived token is embedded in the URL and validated by the backend.
 */
function ResetPasswordPage() {
  // The backend embeds the student email inside this short-lived signed token.
  // useParams() extracts route parameters from the URL path (e.g. /reset-password/:token)
  const { token } = useParams();

  // Two password fields are tracked together via a single state object
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Controls visibility of password fields (single toggle for both)
  const [showPassword, setShowPassword] = useState(false);

  // True while the reset-password API call is in progress
  const [submitting, setSubmitting] = useState(false);

  // Holds validation or server error messages
  const [error, setError] = useState("");

  // Holds a success message shown after a successful reset
  const [successMessage, setSuccessMessage] = useState("");

  // Updates the correct formData field based on the input's name attribute
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  // Validates inputs then calls the API to reset the password
  async function handleSubmit(event) {
    // Prevent the default browser form submission (full-page reload)
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    // Guard clause: if the URL is missing a token, show an error immediately
    if (!token) {
      setError("Your password reset link is invalid. Please request a new one.");
      return;
    }

    // Enforce minimum password length
    if (formData.newPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    // Ensure both password fields match
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSubmitting(true);

    try {
      // Send the token and new password to the backend for verification and update
      const response = await resetPassword(token, formData);
      setSuccessMessage(response?.message || "Password reset successfully.");
      // Clear the form after a successful reset
      setFormData({ newPassword: "", confirmPassword: "" });
    } catch (requestError) {
      // Read the specific error code and message from the backend response shape
      const errorCode = requestError.response?.data?.error?.code;
      const backendMessage = requestError.response?.data?.error?.message;

      // Provide a more helpful message for common token-related failure codes
      if (errorCode === "INVALID_TOKEN" || errorCode === "TOKEN_MISSING") {
        setError(
          "Your password reset link is invalid or has expired. Please request a new one.",
        );
      } else {
        setError(backendMessage || "Password reset failed. Please try again.");
      }
    } finally {
      // Re-enable the form button after the request completes
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-[#f8faf9] px-4 py-14 sm:px-6">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        {/* Header icon — checkmark on success, key icon while the form is visible */}
        <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          {successMessage ? (
            <CheckCircle2 className="size-5" aria-hidden="true" />
          ) : (
            <KeyRound className="size-5" aria-hidden="true" />
          )}
        </span>

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Secure password reset
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {successMessage ? "Password updated" : "Choose a new password"}
        </h1>

        {/* After success the form is replaced with a confirmation and a login link */}
        {successMessage ? (
          <div className="mt-7">
            <p role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              {successMessage} You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white hover:bg-emerald-700"
            >
              Go to login
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-3 leading-7 text-slate-500">
              Use at least eight characters. For security, reset links expire after approximately five minutes.
            </p>

            {/* The reset-password form */}
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <PasswordInput
                label="New password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                showPassword={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
                autoComplete="new-password"
              />
              <PasswordInput
                label="Confirm new password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                showPassword={showPassword}
                onToggle={() => setShowPassword((current) => !current)}
                autoComplete="new-password"
              />

              {/* Error message — only visible when error state is set */}
              {error && (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}

              {/* Submit button swaps its label while the request is in flight */}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Updating password..." : "Reset password"}
                {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
              </button>
            </form>

            {/* Helper links for returning to login or requesting a new reset link */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
              <Link to="/login" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to login
              </Link>
              <Link to="/forgot-password" className="text-emerald-700 hover:text-emerald-800">
                Request a new link
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

/**
 * PasswordInput — A reusable password field with an eye toggle.
 * ...inputProps forwards all extra props (name, value, onChange, autoComplete)
 * to the native <input> so the component stays flexible without repeating props.
 */
function PasswordInput({ label, showPassword, onToggle, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative mt-2 block">
        {/* Lock icon inside the input — pointer-events-none keeps clicks on the input */}
        <LockKeyhole
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        {/* Toggles the input type between "text" (visible) and "password" (masked) */}
        <input
          {...inputProps}
          type={showPassword ? "text" : "password"}
          required
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        {/* Eye toggle — type="button" prevents it from triggering form submit */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </span>
    </label>
  );
}

export default ResetPasswordPage;
