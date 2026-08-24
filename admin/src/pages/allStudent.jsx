import {
  Trash,
  Search,
  TriangleAlert,
  Check,
  MailCheck,
  BadgeCheck,
  BellDot,
  Image,
  SquareOff,
  X,
  Compass,
  Users,
} from 'lucide-react';
import { Field } from '@/components/ui/field';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useEffect, useState } from 'react';
import {
  getAllStudent,
  deleteStudent,
  changeVerifyStatus,
} from '../api/studentApi';
import { Toast } from '../components/Toast';
import { Coord } from '../components/Coord';

function AllStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!alertMessage) return;
    const hideTimer = setTimeout(() => setIsAlertVisible(false), 2700);
    const removeTimer = setTimeout(() => setAlertMessage(null), 3000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [alertMessage]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const data = await getAllStudent(debouncedSearch);
        setStudents(data.data.students);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching students.');
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [debouncedSearch]);

  const notify = (message) => {
    setIsAlertVisible(true);
    setAlertMessage(message);
  };

  const handleDelete = async (student) => {
    try {
      await deleteStudent(student._id);
      setStudents((prev) => prev.filter((s) => s._id !== student._id));
      notify(`Removed ${student.name}`);
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the student.');
    }
  };

  const handleVerifyStudent = async (student) => {
    try {
      await changeVerifyStatus(student._id, true);
      setStudents((prev) =>
        prev.map((s) => (s._id === student._id ? { ...s, verified: true } : s))
      );
      notify(`Verified ${student.name}`);
    } catch (err) {
      setError(err.message || 'An error occurred while verifying the student.');
    }
  };

  const handleRemoveVerification = async (student) => {
    try {
      await changeVerifyStatus(student._id, false);
      setStudents((prev) =>
        prev.map((s) => (s._id === student._id ? { ...s, verified: false } : s))
      );
      notify(`Removed verification for ${student.name}`);
    } catch (err) {
      setError(
        err.message ||
          "An error occurred while removing the student's verification."
      );
    }
  };

  return (
    <section className="mx-auto max-w-8xl px-6 py-10">
      <Toast
        message={alertMessage}
        visible={isAlertVisible}
        onClose={() => {
          setIsAlertVisible(false);
          setTimeout(() => setAlertMessage(null), 300);
        }}
      />

      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            <Compass className="h-3.5 w-3.5" />
            Directory
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Students
          </h1>
        </div>
        {!loading && !error && (
          <Coord tone="cyan">
            {students.length} {students.length === 1 ? 'student' : 'students'}
          </Coord>
        )}
      </div>

      {/* SEARCH */}
      <div className="mx-auto rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
        <Field>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-400/60" />
            <input
              className="w-full bg-transparent py-3 pr-10 pl-11 text-sm font-semibold tracking-wide text-cyan-100 placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
              placeholder="Search students by name, email, or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-500 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </Field>
      </div>

      {/* LIST */}
      <div className="mx-auto max-w-8xl py-10">
        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-400/20 bg-red-500/5 py-16 text-center">
            <TriangleAlert className="h-8 w-8 text-red-400" />
            <p className="font-semibold uppercase tracking-[0.18em] text-red-400">
              {error}
            </p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-3xl border border-cyan-400/10 bg-slate-900/40"
              />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-cyan-400/10 bg-slate-900/40 py-16 text-center">
            <Users className="h-8 w-8 text-slate-600" />
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-500">
              {search ? `No students match “${search}”` : 'No students yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {students.map((student) => (
              <div
                key={student._id}
                className="flex flex-col gap-6 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-cyan-400/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-xl font-black text-cyan-200 ring-1 ring-cyan-300/30">
                    {student.name?.charAt(0).toUpperCase() || '?'}
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 truncate text-xl font-black tracking-tight text-white">
                      {student.name || 'Unnamed student'}
                    </p>
                    <p className="truncate text-sm text-slate-400">
                      {student.email || 'No email provided'}
                    </p>
                    <div className="mt-2">
                      <Coord tone="slate">
                        {student.studentIdNumber || 'N/A'}
                      </Coord>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${student.verified ? 'bg-emerald-400/15 text-emerald-300' : 'bg-amber-400/15 text-amber-300'}`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {student.verified ? 'Verified' : 'Unverified'}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${student.mailVerified ? 'bg-sky-400/15 text-sky-300' : 'bg-slate-400/15 text-slate-300'}`}
                  >
                    <MailCheck className="h-3.5 w-3.5" />
                    {student.mailVerified ? 'Email verified' : 'Email pending'}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex shrink-0 items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative">
                        {student.photoUrl && !student.verified && (
                          <span
                            className="absolute -top-2 -right-2 z-10 rounded-full bg-amber-400 p-1 text-slate-950 ring-2 ring-slate-900"
                            title="Photo awaiting verification"
                            aria-label="Photo awaiting verification"
                          >
                            <BellDot className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <button
                          type="button"
                          title="View photo"
                          aria-label={`View photo for ${student.name || 'student'}`}
                          className="cursor-pointer rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 text-cyan-400 shadow-lg shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
                        >
                          <Image className="h-5 w-5" />
                        </button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950/90 shadow-2xl shadow-cyan-950/20 backdrop-blur-md">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-[0.1em] text-cyan-300 uppercase">
                          Student photo
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        {student.photoUrl ? (
                          <div className="flex flex-col items-start gap-2">
                            <a
                              href={student.photoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-bold text-cyan-400 underline hover:text-cyan-300"
                            >
                              Open photo
                            </a>
                            <span className="text-xs text-slate-500">
                              {student.photoUrl}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-start gap-2">
                            <SquareOff className="h-10 w-10 text-slate-600" />
                            <p className="text-slate-400">
                              No image available.
                            </p>
                          </div>
                        )}
                      </DialogDescription>
                      <DialogFooter>
                        {!student.verified ? (
                          <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">
                              Student is not yet verified
                            </span>
                            <button
                              type="button"
                              onClick={() => handleVerifyStudent(student)}
                              className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/25"
                            >
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Verify student
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <span className="text-xs text-slate-500">
                              Student is verified
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveVerification(student)}
                              className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-full bg-red-400/15 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-400/25"
                            >
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Remove verification
                            </button>
                          </div>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <button
                    type="button"
                    title="Delete"
                    aria-label={`Delete ${student.name || 'student'}`}
                    onClick={() => handleDelete(student)}
                    className="cursor-pointer rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 text-red-400 shadow-lg shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-red-400/30 hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default AllStudent;
