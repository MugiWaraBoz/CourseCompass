// Submits a new password using the short-lived token from the reset route.
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resetPassword } from "@/api/authApi";
import { getErrorMessage } from "@/api/client";
import AuthCard from "@/components/auth/AuthCard";
import { Field, inputClass } from "@/components/common/FormFields";
import { Notice, Submit } from "./LoginPage";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (form.newPassword.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.newPassword !== form.confirmPassword)
      return setError("Passwords do not match.");
    setSaving(true);
    try {
      const { data } = await resetPassword(token.replace(/\}+$/, ""), form);
      setDone(data.message);
    } catch (e2) {
      setError(getErrorMessage(e2));
    } finally {
      setSaving(false);
    }
  }
  return (
    <AuthCard
      title="Choose a new password"
      text="This reset link expires five minutes after it was created."
      footer={
        done && (
          <Link className="font-semibold text-emerald-700" to="/auth/login">
            Continue to sign in
          </Link>
        )
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Notice text={error} />}{" "}
        {done && <Notice success text={done} />}
        <Field label="New password">
          <input
            className={inputClass}
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
        </Field>
        <Field label="Confirm password">
          <input
            className={inputClass}
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
        </Field>
        <Submit saving={saving} label="Reset password" />
      </form>
    </AuthCard>
  );
}
