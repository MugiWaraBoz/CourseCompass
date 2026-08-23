import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { loginStudent } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    // Browser validation handles empty fields; this check enforces the university domain.
    if (!formData.email.toLowerCase().endsWith("@eastdelta.edu.bd")) {
      setError("Use your East Delta University email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await loginStudent({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // The shared provider persists the JWT and exposes the student across the app.
      signIn(response);
      navigate(location.state?.from || "/", { replace: true });
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-5rem)] bg-[#f8faf9] lg:grid-cols-2">
      {/* The supporting panel connects authentication to the product purpose. */}
      <section className="hidden bg-slate-950 px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Student access
          </span>
          <h1 className="mt-8 max-w-xl text-5xl font-semibold leading-tight tracking-tight">
            Continue finding the right academic direction.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Sign in to access student features and contribute verified course and faculty feedback.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          Course Compass · East Delta University
        </p>
      </section>

      {/* The form uses controlled inputs so validation and API state stay predictable. */}
      <section className="flex items-center justify-center px-4 py-14 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to home
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Welcome back
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Sign in to your account
          </h2>
          <p className="mt-3 leading-7 text-slate-500">
            Use your university email and password to continue.
          </p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
            {(location.state?.registrationMessage || location.state?.verificationMessage) && (
              <p
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                {location.state.registrationMessage || location.state.verificationMessage}
              </p>
            )}
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
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  placeholder="name@eastdelta.edu.bd"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </span>
            </label>

            <label className="block">
              <span className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700">
                  Password
                </span>
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Forgot password?
                </Link>
              </span>
              <span className="relative mt-2 block">
                <LockKeyhole
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
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

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
              {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            New to Course Compass?{" "}
            <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
