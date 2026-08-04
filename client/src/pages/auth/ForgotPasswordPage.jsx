// Requests and displays the password-reset link supplied by the backend.
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/api/authApi";
import { getErrorMessage } from "@/api/client";
import AuthCard from "@/components/auth/AuthCard";
import { Field, inputClass } from "@/components/common/FormFields";
import { Notice, Submit } from "./LoginPage";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await forgotPassword(email);
      setResult({
        message: data.message,
        link: data.resetLink?.replace(/\}+$/, ""),
      });
    } catch (e2) {
      setError(getErrorMessage(e2));
    } finally {
      setSaving(false);
    }
  }
  return (
    <AuthCard
      title="Reset your password"
      text="Enter your EDU email to generate a five-minute reset link."
      footer={
        <Link className="font-semibold text-emerald-700" to="/auth/login">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Notice text={error} />}{" "}
        {result && (
          <div>
            <Notice success text={result.message} />
            {result.link && (
              <a
                className="mt-3 block break-all rounded-xl border border-emerald-200 p-3 text-xs text-emerald-700"
                href={result.link}
              >
                {result.link}
              </a>
            )}
          </div>
        )}
        <Field label="University email">
          <input
            className={inputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Submit saving={saving} label="Generate reset link" />
      </form>
    </AuthCard>
  );
}
