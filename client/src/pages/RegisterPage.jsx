import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { registerStudent } from "@/api/authApi";

const initialFormData = {
  name: "",
  studentIdNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  cgpa: "",
};

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function validateForm() {
    if (!formData.email.trim().toLowerCase().endsWith("@eastdelta.edu.bd")) {
      return "Use your East Delta University email address.";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (formData.cgpa !== "") {
      const cgpa = Number(formData.cgpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
        return "CGPA must be between 0 and 4.";
      }
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      // confirmPassword belongs only to the UI and must not be sent to the backend.
      const response = await registerStudent({
        name: formData.name.trim(),
        studentIdNumber: formData.studentIdNumber.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        cgpa: formData.cgpa === "" ? null : Number(formData.cgpa),
      });

      // The backend asks newly registered students to log in before continuing.
      navigate("/login", {
        replace: true,
        state: {
          registrationMessage:
            response?.data?.message || "Account created successfully. Please sign in.",
        },
      });
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-5rem)] bg-[#f8faf9] lg:grid-cols-[0.8fr_1.2fr]">
      {/* The brand panel stays concise because the registration form is longer. */}
      <section className="hidden bg-slate-950 px-12 py-16 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            <GraduationCap className="size-4" aria-hidden="true" />
            Join Course Compass
          </span>
          <h1 className="mt-8 max-w-lg text-5xl font-semibold leading-tight tracking-tight">
            Make informed academic choices together.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Create your student account to contribute useful course and faculty experiences.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          University accounts only · Student verification follows registration
        </p>
      </section>

      {/* Controlled inputs provide immediate validation before API submission. */}
      <section className="flex items-center justify-center px-4 py-14 sm:px-6 lg:px-12">
        <div className="w-full max-w-2xl">
          <Link
            to="/login"
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            ← Back to login
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Student registration
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            Create your account
          </h2>
          <p className="mt-3 leading-7 text-slate-500">
            Enter your university information. Your account starts as unverified.
          </p>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <Field
              label="Full name"
              icon={UserRound}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="name"
              placeholder="Your full name"
            />
            <Field
              label="Student ID"
              icon={IdCard}
              name="studentIdNumber"
              value={formData.studentIdNumber}
              onChange={handleInputChange}
              placeholder="Your student ID"
            />
            <div className="sm:col-span-2">
              <Field
                label="University email"
                icon={Mail}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                placeholder="name@eastdelta.edu.bd"
              />
            </div>
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              showPassword={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              showPassword={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              autoComplete="new-password"
            />
            <Field
              label="CGPA (optional)"
              icon={GraduationCap}
              name="cgpa"
              type="number"
              value={formData.cgpa}
              onChange={handleInputChange}
              min="0"
              max="4"
              step="0.01"
              placeholder="0.00 – 4.00"
            />

            {error && (
              <p
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            >
              {submitting ? "Creating account..." : "Create account"}
              {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

// Shared field markup keeps labels, icons, focus styles, and required state consistent.
function Field({ label, icon: Icon, ...inputProps }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="relative mt-2 block">
        <Icon
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          {...inputProps}
          required={inputProps.name !== "cgpa"}
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
      </span>
    </label>
  );
}

function PasswordField({ label, showPassword, onToggle, ...inputProps }) {
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
          type={showPassword ? "text" : "password"}
          required
          className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
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

export default RegisterPage;
