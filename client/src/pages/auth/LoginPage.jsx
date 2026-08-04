// Authenticates returning students and restores their intended destination.
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { login } from "@/api/authApi";
import { getErrorMessage } from "@/api/client";
import AuthCard from "@/components/auth/AuthCard";
import { Field, inputClass } from "@/components/common/FormFields";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { token, startSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  if (token) return <Navigate to="/profile" replace />;
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await login(form);
      startSession(data.token, data.data.student);
      navigate(location.state?.from || "/profile", { replace: true });
    } catch (e2) {
      setError(getErrorMessage(e2));
    } finally {
      setSaving(false);
    }
  }
  return (
    <AuthCard
      title="Welcome back"
      text="Sign in with your East Delta University email."
      footer={
        <>
          New here?{" "}
          <Link className="font-semibold text-emerald-700" to="/auth/register">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Notice text={error} />}
        <Field label="University email">
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@eastdelta.edu.bd"
            required
          />
        </Field>
        <Field label="Password">
          <input
            className={inputClass}
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Field>
        <div className="text-right">
          <Link
            to="/auth/forgot-password"
            className="text-xs font-medium text-emerald-700"
          >
            Forgot password?
          </Link>
        </div>
        <Submit saving={saving} label="Sign in" />
      </form>
    </AuthCard>
  );
}
export function Notice({ text, success = false }) {
  return (
    <p
      className={`rounded-xl p-3 text-sm ${success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
    >
      {text}
    </p>
  );
}
export function Submit({ saving, label }) {
  return (
    <button
      disabled={saving}
      className="h-11 w-full rounded-full bg-slate-900 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
    >
      {saving ? "Please wait..." : label}
    </button>
  );
}
