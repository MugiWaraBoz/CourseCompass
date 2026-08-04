import { useState } from "react";
import { updateMe } from "@/api/studentApi";
import { getErrorMessage } from "@/api/client";
import { useAuth } from "@/context/AuthContext";
import ProfileShell from "@/components/profile/ProfileShell";
import { Field, inputClass } from "@/components/common/FormFields";
import { Notice } from "@/pages/auth/LoginPage";

export default function EditProfilePage() {
  const { student, updateStudent } = useAuth(); const [form, setForm] = useState({ name: student?.name || "", cgpa: student?.cgpa ?? "", photoUrl: student?.photoUrl || "" }); const [error, setError] = useState(""); const [done, setDone] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(e) { e.preventDefault(); setSaving(true); setError(""); setDone(""); try { const { data } = await updateMe({ name: form.name.trim(), cgpa: form.cgpa === "" ? null : Number(form.cgpa), photoUrl: form.photoUrl || null }); updateStudent(data.data.student); setDone(data.data.message); } catch (e2) { setError(getErrorMessage(e2)); } finally { setSaving(false); } }
  return <ProfileShell title="Edit profile" text="Keep your basic student information up to date."><form onSubmit={submit} className="max-w-2xl space-y-5 rounded-3xl border bg-white p-7 shadow-sm">{error && <Notice text={error}/>} {done && <Notice success text={done}/>}<Field label="Full name"><input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required/></Field><Field label="CGPA"><input className={inputClass} type="number" min="0" max="4" step="0.01" value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })}/></Field><Field label="Photo URL (optional)"><input className={inputClass} type="url" value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })}/></Field><button disabled={saving} className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? "Saving..." : "Save profile"}</button></form></ProfileShell>;
}
