// Registers students after validating their university account details.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/api/authApi";
import { getErrorMessage } from "@/api/client";
import AuthCard from "@/components/auth/AuthCard";
import { Field, inputClass } from "@/components/common/FormFields";
import { useAuth } from "@/context/AuthContext";
import { Notice, Submit } from "./LoginPage";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { startSession } = useAuth();
  const [form, setForm] = useState({
    name: "",
    studentIdNumber: "",
    email: "",
    password: "",
    confirm: "",
    cgpa: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.email.toLowerCase().endsWith("@eastdelta.edu.bd"))
      return setError("Use your @eastdelta.edu.bd email address.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        studentIdNumber: form.studentIdNumber.trim(),
        email: form.email.trim(),
        password: form.password,
        cgpa: form.cgpa === "" ? null : Number(form.cgpa),
      };
      const { data } = await register(payload);
      startSession(data.token, data.data.student);
      navigate("/profile");
    } catch (e2) {
      setError(getErrorMessage(e2));
    } finally {
      setSaving(false);
    }
  }
  return (
    <AuthCard
      title="Create your account"
      text="Join using your university details."
      footer={
        <>
          Already registered?{" "}
          <Link className="font-semibold text-emerald-700" to="/auth/login">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <Notice text={error} />}
        <Field label="Full name">
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </Field>
        <Field label="Student ID">
          <input
            className={inputClass}
            value={form.studentIdNumber}
            onChange={(e) => set("studentIdNumber", e.target.value)}
            required
          />
        </Field>
        <Field label="University email">
          <input
            className={inputClass}
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="name@eastdelta.edu.bd"
            required
          />
        </Field>
        <Field label="CGPA (optional)">
          <input
            className={inputClass}
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={form.cgpa}
            onChange={(e) => set("cgpa", e.target.value)}
          />
        </Field>
        <Field label="Password">
          <input
            className={inputClass}
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
          />
        </Field>
        <Field label="Confirm password">
          <input
            className={inputClass}
            type="password"
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            required
          />
        </Field>
        <Submit saving={saving} label="Create account" />
      </form>
    </AuthCard>
  );
}
