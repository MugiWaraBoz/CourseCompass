// Validates and submits password changes for the logged-in student.
import { useState } from "react";
import { changePassword } from "@/api/authApi";
import { getErrorMessage } from "@/api/client";
import ProfileShell from "@/components/profile/ProfileShell";
import { Field, inputClass } from "@/components/common/FormFields";
import { Notice } from "@/pages/auth/LoginPage";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setDone("");
    if (form.newPassword.length < 6)
      return setError("New password must be at least 6 characters.");
    if (form.newPassword !== form.confirmPassword)
      return setError("New passwords do not match.");
    setSaving(true);
    try {
      const { data } = await changePassword(form);
      setDone(data.message);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e2) {
      setError(getErrorMessage(e2));
    } finally {
      setSaving(false);
    }
  }
  return (
    <ProfileShell
      title="Change password"
      text="Choose a password you do not use elsewhere."
    >
      <form
        onSubmit={submit}
        className="max-w-2xl space-y-5 rounded-3xl border bg-white p-7 shadow-sm"
      >
        {error && <Notice text={error} />}{" "}
        {done && <Notice success text={done} />}
        <Field label="Current password">
          <input
            className={inputClass}
            type="password"
            value={form.oldPassword}
            onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
            required
          />
        </Field>
        <Field label="New password">
          <input
            className={inputClass}
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            required
          />
        </Field>
        <Field label="Confirm new password">
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
        <button
          disabled={saving}
          className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Change password"}
        </button>
      </form>
    </ProfileShell>
  );
}
