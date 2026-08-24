import {
  SquarePen,
  Trash,
  Search,
  TriangleAlert,
  X,
  CirclePlus,
  Compass,
  BookOpen,
} from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import {
  getCourses,
  getCourseInfo,
  updateCourse,
  deleteCourse,
  addCourse,
} from '../api/courseApi';
import { Toast } from '../components/Toast';
import { Coord } from '../components/Coord';

const emptyForm = { code: '', name: '', department: '', credit: '' };

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [newCourse, setNewCourse] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

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
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getCourses(debouncedSearch);
        setCourses(data.data.courses);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching courses.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [debouncedSearch]);

  const notify = (message) => {
    setIsAlertVisible(true);
    setAlertMessage(message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (course) => {
    try {
      const courseInfo = await getCourseInfo(course._id);
      setSelectedCourse(courseInfo.data.course);
      setFormData({
        code: courseInfo.data.course.code,
        name: courseInfo.data.course.name,
        department: courseInfo.data.course.department,
        credit: courseInfo.data.course.credit,
      });
    } catch (err) {
      console.error('Error fetching course info:', err);
    }
  };

  const handleDelete = async (course) => {
    try {
      await deleteCourse(course._id);
      setCourses((prev) => prev.filter((c) => c._id !== course._id));
      notify(`Removed ${course.code}`);
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || isSaving) return;

    setIsSaving(true);
    try {
      const updatedCourse = {
        ...selectedCourse,
        ...formData,
        credit: Number(formData.credit),
      };

      await updateCourse(selectedCourse._id, updatedCourse);
      setCourses((prev) =>
        prev.map((course) =>
          course._id === selectedCourse._id ? updatedCourse : course
        )
      );
      setSelectedCourse(null);
      notify('Course updated');
    } catch (err) {
      console.error('Error updating course:', err);
      notify(err.message || 'Unable to update course');
    } finally {
      setIsSaving(false);
    }
  };

  const submitNewCourse = async (e) => {
    e.preventDefault();
    try {
      await addCourse(formData);
      setNewCourse(null);
      notify('Course added');
    } catch (err) {
      console.error('Error adding new course:', err);
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
            Catalog
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Courses
          </h1>
        </div>
        {!loading && !error && (
          <Coord tone="cyan">
            {courses.length} {courses.length === 1 ? 'course' : 'courses'}
          </Coord>
        )}
      </div>

      {/* SEARCH + ADD */}
      <div className="flex flex-col gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:flex-row sm:items-center">
        <Field className="flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-400/60" />
            <input
              className="w-full bg-transparent py-3 pr-10 pl-11 text-sm font-semibold tracking-wide text-cyan-100 placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
              placeholder="Search courses by code, name, or department…"
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
        <button
          type="button"
          onClick={() => {
            setFormData(emptyForm);
            setNewCourse(true);
          }}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/25"
        >
          <CirclePlus className="h-4 w-4" />
          Add course
        </button>
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
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-3xl border border-cyan-400/10 bg-slate-900/40"
              />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-cyan-400/10 bg-slate-900/40 py-16 text-center">
            <BookOpen className="h-8 w-8 text-slate-600" />
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-500">
              {search ? `No courses match “${search}”` : 'No courses yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col justify-between gap-6 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-cyan-400/30"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Coord tone="cyan">{course.code}</Coord>
                    {course.credit !== undefined && course.credit !== '' && (
                      <span className="rounded-full bg-slate-400/10 px-3 py-1 text-[11px] font-semibold text-slate-300">
                        {course.credit} credits
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-black tracking-tight text-white">
                    {course.name}
                  </h1>
                  {course.department && (
                    <p className="mt-1 text-sm text-slate-400">
                      {course.department}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(course)}
                    aria-label={`Edit ${course.code}`}
                    className="flex-1 cursor-pointer rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 text-cyan-400 shadow-lg shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    <SquarePen className="mx-auto h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(course)}
                    aria-label={`Delete ${course.code}`}
                    className="flex-1 cursor-pointer rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 text-red-400 shadow-lg shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-red-400/30 hover:text-red-300"
                  >
                    <Trash className="mx-auto h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT PANEL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <form
            className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl"
            onSubmit={submitEdit}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Coord tone="cyan">{selectedCourse.code}</Coord>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  {selectedCourse.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-slate-300">
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Course code
                </FieldLabel>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Course name
                </FieldLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Department
                </FieldLabel>
                <Input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Credits
                </FieldLabel>
                <Input
                  name="credit"
                  value={formData.credit}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl border border-cyan-400/20 px-5 py-3 font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NEW COURSE FORM */}
      {newCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Add course</h2>
              <button
                onClick={() => setNewCourse(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-slate-300">
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Course code
                </FieldLabel>
                <Input
                  name="code"
                  value={formData.code}
                  placeholder="Ex: CSE101"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Course name
                </FieldLabel>
                <Input
                  name="name"
                  value={formData.name}
                  placeholder="Ex: Data Structures"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Department
                </FieldLabel>
                <Input
                  name="department"
                  value={formData.department}
                  placeholder="Ex: CSE"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Credits
                </FieldLabel>
                <Input
                  name="credit"
                  value={formData.credit}
                  placeholder="Ex: 3"
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setNewCourse(null)}
                className="rounded-xl border border-cyan-400/20 px-5 py-3 font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={submitNewCourse}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                Add course
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AllCourses;
