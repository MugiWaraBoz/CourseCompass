import { useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Mail } from "lucide-react";
import { Link } from "react-router";
import { forgotPassword } from "@/api/authApi";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@eastdelta.edu.bd")) {
      setError("Use your East Delta University email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await forgotPassword(normalizedEmail);
      setSuccessMessage(
        response?.message ||
          "Password reset instructions have been sent to your university email.",
      );
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "We could not process your request right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-[#f8faf9] px-4 py-14 sm:px-6">
      {/* This focused card matches the existing authentication visual system. */}
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <KeyRound className="size-5" aria-hidden="true" />
        </span>

        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Password recovery
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Forgot your password?
        </h1>
        <p className="mt-3 leading-7 text-slate-500">
          Enter your registered university email. The reset link will expire in approximately five minutes.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              University email
            </span>
            <span className="relative mt-2 block">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                disabled={submitting}
                placeholder="name@eastdelta.edu.bd"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:bg-slate-50"
              />
            </span>
          </label>

          {error && (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
            {submitting ? "Sending reset link..." : "Send reset link"}
            {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to login
        </Link>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
