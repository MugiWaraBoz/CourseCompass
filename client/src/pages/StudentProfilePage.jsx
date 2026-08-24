import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  GraduationCap,
  IdCard,
  KeyRound,
  Mail,
  Pencil,
  PenLine,
  Save,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router";
import {
  deleteReview,
  getCurrentStudentReviews,
  removeGeminiApiKey,
  setGeminiApiKey,
  updateReview,
} from "@/api/authApi";
import { testGeminiApiKey } from "@/api/aiApi";
import { useAuth } from "@/hooks/useAuth";
import AiCookingState from "@/components/ui/AiCookingState";

/**
 * StudentProfilePage
 *
 * The main profile dashboard for logged-in students. It displays identity
 * information, verification status, review history, editable personal
 * fields, AI (Gemini) API key management, and security shortcuts.
 *
 * React concepts used here:
 * - useState for local UI state (form values, loading flags, errors)
 * - useEffect for side-effects (fetching reviews, checking Gemini status)
 * - Conditional rendering to toggle between read-only and edit modes
 * - Derived state (e.g. review form pre-fills from the selected review)
 */

// Format registration dates without exposing raw database timestamps.
function formatJoinDate(dateValue) {
  if (!dateValue) return "Unavailable";

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function StudentProfilePage() {
  // ===== HOOKS =====
  // useAuth provides the current student object, JWT token, and a
  // helper to send profile-update requests to the backend.
  const { student, token, updateProfile } = useAuth();

  // ===== STATE: Profile editing =====
  // isEditing toggles between read-only view and the edit form.
  const [isEditing, setIsEditing] = useState(false);
  // formData mirrors the editable profile fields so the form is controlled.
  const [formData, setFormData] = useState({
    name: student.name || "",
    cgpa: student.cgpa ?? "",
    photoUrl: student.photoUrl || "",
  });
  // saving shows a spinner while the profile-update request is in flight.
  const [saving, setSaving] = useState(false);
  // error / successMessage provide inline feedback for the edit form.
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ===== STATE: Reviews =====
  // reviews holds the list of reviews written by this student.
  const [reviews, setReviews] = useState([]);
  // reviewsLoading is true while the initial fetch is in progress.
  const [reviewsLoading, setReviewsLoading] = useState(true);
  // reviewsError stores a message if the fetch fails.
  const [reviewsError, setReviewsError] = useState("");
  // editingReviewId tracks which review is currently in edit mode (null = none).
  const [editingReviewId, setEditingReviewId] = useState(null);
  // reviewForm holds the in-progress edits for the active review.
  const [reviewForm, setReviewForm] = useState({
    rating: "",
    difficultyRating: "",
    semester: "",
    comment: "",
  });
  // reviewSaving is true while a save/delete request is in flight.
  const [reviewSaving, setReviewSaving] = useState(false);
  // reviewActionError stores feedback for review save/delete failures.
  const [reviewActionError, setReviewActionError] = useState("");

  // ===== STATE: Gemini API key management =====
  // geminiKey holds the raw key the user is typing (never persisted locally).
  const [geminiKey, setGeminiKey] = useState("");
  // geminiConfigured is true when a valid key is already saved on the backend.
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  // geminiSaving / geminiTesting / geminiRemoving track request states.
  const [geminiSaving, setGeminiSaving] = useState(false);
  const [geminiTesting, setGeminiTesting] = useState(false);
  const [geminiRemoving, setGeminiRemoving] = useState(false);
  // geminiStatusLoading is true while the initial key-check runs.
  const [geminiStatusLoading, setGeminiStatusLoading] = useState(true);
  // geminiMessage / geminiError provide inline feedback for Gemini actions.
  const [geminiMessage, setGeminiMessage] = useState("");
  const [geminiError, setGeminiError] = useState("");

  // ===== EFFECTS =====

  // On mount, probe the backend to see whether a Gemini key is already
  // configured. The "active" flag prevents state updates after unmount
  // (a common React pattern to avoid memory-leak warnings).
  useEffect(() => {
    let active = true;

    testGeminiApiKey(token)
      .then(() => {
        if (active) setGeminiConfigured(true);
      })
      .catch((requestError) => {
        if (!active) return;
        if (requestError.response?.data?.error?.code === "API_KEY_NOT_FOUND") {
          setGeminiConfigured(false);
        } else {
          setGeminiError("Gemini status could not be checked. Try the Test API Key button.");
        }
      })
      .finally(() => {
        if (active) setGeminiStatusLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  // Fetch the current student's review history on mount.
  // Same "active" cleanup pattern as above.
  useEffect(() => {
    let active = true;

    getCurrentStudentReviews(token)
      .then((response) => {
        if (active) {
          setReviews(response?.data?.reviews || []);
          setReviewsError("");
        }
      })
      .catch((requestError) => {
        if (!active) return;
        setReviewsError(
          requestError.response?.data?.error?.message ||
            "Your reviews could not be loaded right now.",
        );
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  // ===== HANDLERS: Profile form =====

  // Generic controlled-input handler – updates whichever field matches
  // the input's `name` attribute.
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  // Resets the form back to the original student data and exits edit mode.
  function cancelEditing() {
    setFormData({
      name: student.name || "",
      cgpa: student.cgpa ?? "",
      photoUrl: student.photoUrl || "",
    });
    setError("");
    setIsEditing(false);
  }

  // ===== HANDLERS: Reviews =====

  // Populates the review form with the selected review's current values
  // so the user can edit inline.
  function startReviewEditing(review) {
    setReviewActionError("");
    setEditingReviewId(review._id);
    setReviewForm({
      rating: review.rating ?? "",
      difficultyRating: review.difficultyRating ?? "",
      semester: review.semester ?? "",
      comment: review.comment ?? "",
    });
  }

  // Exits review-edit mode without saving.
  function cancelReviewEditing() {
    setEditingReviewId(null);
    setReviewActionError("");
  }

  // Controlled-input handler for the review edit form.
  function handleReviewInputChange(event) {
    const { name, value } = event.target;
    setReviewForm((current) => ({ ...current, [name]: value }));
  }

  // Sends the updated review to the backend, then replaces it in the
  // local reviews array so the UI updates without a full refetch.
  async function handleReviewSave(event) {
    event.preventDefault();
    setReviewActionError("");

    if (!reviewForm.comment.trim()) {
      setReviewActionError("Review comment cannot be empty.");
      return;
    }

    setReviewSaving(true);
    try {
      const response = await updateReview(token, editingReviewId, {
        rating: Number(reviewForm.rating),
        difficultyRating: Number(reviewForm.difficultyRating),
        semester: reviewForm.semester.trim(),
        comment: reviewForm.comment.trim(),
      });
      const updatedReview = response?.data?.review;

      setReviews((current) =>
        current.map((review) =>
          review._id === editingReviewId
            ? updatedReview || { ...review, ...reviewForm }
            : review,
        ),
      );
      setEditingReviewId(null);
    } catch (requestError) {
      setReviewActionError(
        requestError.response?.data?.error?.message ||
          "Review update failed. Please try again.",
      );
    } finally {
      setReviewSaving(false);
    }
  }

  // Asks for confirmation, then deletes the review and removes it from
  // local state.
  async function handleReviewDelete(reviewId) {
    if (!window.confirm("Delete this review? This action cannot be undone.")) return;

    setReviewActionError("");
    setReviewSaving(true);
    try {
      await deleteReview(token, reviewId);
      setReviews((current) => current.filter((review) => review._id !== reviewId));
    } catch (requestError) {
      setReviewActionError(
        requestError.response?.data?.error?.message ||
          "Review deletion failed. Please try again.",
      );
    } finally {
      setReviewSaving(false);
    }
  }

  // Validates and submits the profile-edit form.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (formData.cgpa !== "") {
      const cgpa = Number(formData.cgpa);
      if (Number.isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
        setError("CGPA must be between 0 and 4.");
        return;
      }
    }

    const trimmedPhotoUrl = formData.photoUrl.trim();
    if (trimmedPhotoUrl) {
      try {
        const parsedUrl = new URL(trimmedPhotoUrl);
        if (!/^https?:$/.test(parsedUrl.protocol)) throw new Error("Invalid URL");
      } catch {
        setError("Student ID picture link must be a valid URL.");
        return;
      }
    }

    setSaving(true);

    try {
      const response = await updateProfile({
        name: formData.name.trim(),
        cgpa: formData.cgpa === "" ? null : Number(formData.cgpa),
        photoUrl: trimmedPhotoUrl || null,
      });

      setSuccessMessage(response?.data?.message || "Profile updated successfully.");
      setIsEditing(false);
    } catch (requestError) {
      const backendMessage = requestError.response?.data?.error?.message;
      setError(backendMessage || requestError.message || "Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  // ===== HANDLERS: Gemini API key =====

  // Maps common backend error codes to user-friendly messages.
  function getGeminiError(requestError, fallback) {
    const code = requestError.response?.data?.error?.code;
    if (code === "API_KEY_NOT_FOUND") return "Please configure your Gemini API key first.";
    if (requestError.response?.status === 401) return "Please log in again.";
    if (requestError.response?.status === 429) return "Gemini request limit reached. Please try again later.";
    return fallback;
  }

  // Saves or updates the Gemini API key on the backend.
  async function handleSaveGeminiKey(event) {
    event.preventDefault();
    const trimmedKey = geminiKey.trim();
    setGeminiError("");
    setGeminiMessage("");
    setGeminiStatusLoading(false);

    if (!trimmedKey) {
      setGeminiError("Enter a Gemini API key before saving.");
      return;
    }

    setGeminiSaving(true);
    try {
      await setGeminiApiKey(token, trimmedKey);
      setGeminiKey("");
      setGeminiConfigured(true);
      setGeminiMessage("Gemini API key saved securely.");
    } catch (requestError) {
      setGeminiError(getGeminiError(requestError, "Gemini API key could not be saved."));
    } finally {
      setGeminiSaving(false);
    }
  }

  // Verifies the stored key by sending a test request to the backend.
  async function handleTestGeminiKey() {
    setGeminiError("");
    setGeminiMessage("");
    setGeminiTesting(true);
    try {
      await testGeminiApiKey(token);
      setGeminiMessage("Gemini API key is working.");
      setGeminiConfigured(true);
    } catch (requestError) {
      if (requestError.response?.data?.error?.code === "API_KEY_NOT_FOUND") {
        setGeminiConfigured(false);
      }
      setGeminiError(getGeminiError(requestError, "Gemini API key test failed."));
    } finally {
      setGeminiTesting(false);
    }
  }

  // Deletes the stored Gemini key from the backend.
  async function handleRemoveGeminiKey() {
    setGeminiError("");
    setGeminiMessage("");
    setGeminiRemoving(true);
    try {
      await removeGeminiApiKey(token);
      setGeminiConfigured(false);
      setGeminiMessage("Gemini API key removed.");
    } catch (requestError) {
      setGeminiError(getGeminiError(requestError, "Gemini API key could not be removed."));
    } finally {
      setGeminiRemoving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8faf9]">

      {/* ===== HEADER SECTION =====
          Displays the student's name, email, and a decorative avatar.
          All data comes from the session – nothing is fetched here. */}
      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center">
          <span className="grid size-20 shrink-0 place-items-center rounded-3xl border border-white/10 bg-emerald-400/10 text-emerald-300">
            <UserRound className="size-8" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              Student account
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {student.name}
            </h1>
            <p className="mt-3 text-slate-300">{student.email}</p>
          </div>
        </div>
      </section>

      {/* ===== VERIFICATION STATUS =====
          Shows whether the student's identity has been verified.
          Uses conditional classes to tint the card green or amber. */}
      <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
        <div
          className={`flex items-start gap-4 rounded-3xl border p-6 ${
            student.verified
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          {student.verified ? (
            <BadgeCheck className="mt-0.5 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
          ) : (
            <ShieldAlert className="mt-0.5 size-6 shrink-0 text-amber-700" aria-hidden="true" />
          )}
          <div>
            <h2 className="font-semibold text-slate-950">
              {student.verified ? "Verified student" : "Verification pending"}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {student.verified
                ? "Your student identity has been verified."
                : "Your account is active but has not yet received a verified badge."}
            </p>
          </div>
        </div>
      </section>

      {/* ===== READ-ONLY PROFILE FIELDS =====
          These cards show identity data that is not yet editable via
          the form (Student ID number, email, join date). */}
      <section className="mx-auto grid max-w-5xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:px-8">
        <ProfileField icon={IdCard} label="Student ID" value={student.studentIdNumber} />
        <ProfileField icon={Mail} label="University email" value={student.email} />
        <ProfileField
          icon={GraduationCap}
          label="CGPA"
          value={student.cgpa ?? "Not provided"}
        />
        <ProfileField
          icon={CalendarDays}
          label="Member since"
          value={formatJoinDate(student.createdAt)}
        />
      </section>

      {/* ===== EDITABLE SECTIONS (reviews, settings, AI, security) ===== */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* ----- Review history -----
            Lists all reviews the student has written.
            Each review can be edited inline or deleted with confirmation. */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Your reviews
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Review history
            </h2>
          </div>

          {reviewActionError && (
            <p role="alert" className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {reviewActionError}
            </p>
          )}

          {reviewsLoading ? (
            <p className="mt-6 text-sm text-slate-500">Loading your reviews...</p>
          ) : reviewsError ? (
            <p role="alert" className="mt-6 text-sm text-red-700">{reviewsError}</p>
          ) : reviews.length === 0 ? (
            <p className="mt-6 text-sm text-slate-500">You have not written any reviews yet.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {reviews.map((review) => (
                <article key={review._id} className="rounded-2xl border border-slate-200 p-5">
                  {editingReviewId === review._id ? (
                    /* Inline edit form – shown only for the active review */
                    <form className="grid gap-4" onSubmit={handleReviewSave}>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <ReviewNumberInput label="Rating" name="rating" value={reviewForm.rating} onChange={handleReviewInputChange} />
                        <ReviewNumberInput label="Difficulty" name="difficultyRating" value={reviewForm.difficultyRating} onChange={handleReviewInputChange} />
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Semester</span>
                          <input name="semester" value={reviewForm.semester} onChange={handleReviewInputChange} className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500" />
                        </label>
                      </div>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Comment</span>
                        <textarea name="comment" value={reviewForm.comment} onChange={handleReviewInputChange} rows={4} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-emerald-500" />
                      </label>
                      <div className="flex flex-wrap justify-end gap-3">
                        <button type="button" onClick={cancelReviewEditing} className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700">
                          <X className="size-4" aria-hidden="true" /> Cancel
                        </button>
                        <button type="submit" disabled={reviewSaving} className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60">
                          <Save className="size-4" aria-hidden="true" /> {reviewSaving ? "Saving..." : "Save review"}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Read-only review card with Edit / Delete buttons */
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-950">{review.comment || "No comment"}</p>
                          <p className="mt-2 text-sm text-slate-500">
                            Rating {review.rating ?? "-"}/5 · Difficulty {review.difficultyRating ?? "-"}/5 · {review.semester || "Semester unavailable"}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button type="button" onClick={() => startReviewEditing(review)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-700">
                            <Pencil className="size-3.5" aria-hidden="true" /> Edit
                          </button>
                          <button type="button" onClick={() => handleReviewDelete(review._id)} disabled={reviewSaving} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 px-3 text-sm font-semibold text-red-700 disabled:opacity-60">
                            <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>

        {/* ----- Account settings -----
            Lets the student edit their name, CGPA, and profile photo URL.
            Uses a toggle: click "Edit profile" to reveal the form. */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Account settings
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Personal information
              </h2>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage("");
                  setIsEditing(true);
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit profile
              </button>
            )}
          </div>

          {successMessage && (
            <p role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {successMessage}
            </p>
          )}

          {isEditing && (
            <form className="mt-7 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Full name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">CGPA (optional)</span>
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  min="0"
                  max="4"
                  step="0.01"
                  placeholder="0.00 – 4.00"
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Student ID Picture Link</span>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/my-id-picture.jpg"
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              {error && (
                <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="h-11 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="size-4" aria-hidden="true" />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ----- AI (Gemini) settings -----
            Manage the Google Gemini API key used for AI-powered features.
            The key is never displayed back – only save / test / remove. */}
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
            AI settings
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Google Gemini</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your key is encrypted and used by the backend for Gemini-powered summaries. It is never shown here.
          </p>

          <form className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={handleSaveGeminiKey}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Gemini API Key</span>
              <input
                type="password"
                value={geminiKey}
                onChange={(event) => setGeminiKey(event.target.value)}
                autoComplete="off"
                placeholder={geminiConfigured ? "Enter a new key to update" : "Enter your Gemini API key"}
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </label>
            <button type="submit" disabled={geminiSaving || !geminiKey.trim()} className="sm:mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {geminiSaving ? "Saving..." : geminiConfigured ? "Update key" : "Save key"}
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleTestGeminiKey} disabled={geminiTesting || geminiSaving || geminiStatusLoading} className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-200 px-4 text-sm font-semibold text-emerald-700 disabled:opacity-60">
              {geminiTesting ? "Testing..." : "Test API Key"}
            </button>
            {geminiConfigured && (
              <button type="button" onClick={handleRemoveGeminiKey} disabled={geminiRemoving || geminiTesting} className="inline-flex h-10 items-center justify-center rounded-full border border-red-200 px-4 text-sm font-semibold text-red-700 disabled:opacity-60">
                {geminiRemoving ? "Removing..." : "Remove key"}
              </button>
            )}
            {geminiStatusLoading ? (
              <span className="text-sm text-slate-500">Checking Gemini configuration...</span>
            ) : (
              <span className="text-sm text-slate-500">
                {geminiConfigured ? "API key configured and ready" : "No API key configured"}
              </span>
            )}
          </div>

          {(geminiStatusLoading || geminiTesting) && (
            <AiCookingState label={geminiStatusLoading ? "Checking your Gemini connection" : "Testing your Gemini API key"} />
          )}

          {geminiMessage && <p role="status" className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{geminiMessage}</p>}
          {geminiError && <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{geminiError}</p>}
        </div>

        {/* ----- Security: Password -----
            Password changes are handled on a separate dedicated page
            for better UX and security (current-password verification). */}
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Security
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Password
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Update your password using your current password.
            </p>
          </div>
          <Link
            to="/profile/change-password"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            <KeyRound className="size-4" aria-hidden="true" />
            Change password
          </Link>
        </div>

        {/* ----- Student feedback: Write a review -----
            Quick-link to the review creation page. */}
        <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Student feedback
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Share your experience
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Help other students by reviewing a course and its faculty member.
            </p>
          </div>
          <Link
            to="/profile/write-review"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <PenLine className="size-4" aria-hidden="true" />
            Write a review
          </Link>
        </div>
      </section>
    </main>
  );
}

// ===== SHARED SUB-COMPONENTS =====

/**
 * ReviewNumberInput – A reusable numeric input for rating/difficulty fields.
 * Accepts a label, field name, current value, and onChange callback.
 */
function ReviewNumberInput({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input type="number" min="0" max="5" step="0.5" name={name} value={value} onChange={onChange} required className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-emerald-500" />
    </label>
  );
}

/**
 * ProfileField – A read-only card that displays a single profile attribute
 * (icon + label + value). Used for Student ID, email, CGPA, and join date.
 */
function ProfileField({ icon: Icon, label, value }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Icon className="size-5 text-emerald-700" aria-hidden="true" />
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-xl font-semibold text-slate-950">
        {value || "Not provided"}
      </p>
    </article>
  );
}

export default StudentProfilePage;
