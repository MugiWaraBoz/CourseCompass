import {
  SquarePen,
  Trash,
  Search,
  TriangleAlert,
  X,
  CirclePlus,
  Compass,
  GraduationCap,
} from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import {
  getFacultys,
  getFacultyInfo,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from '../api/facultyApi';
import { Toast } from '../components/Toast';
import { Coord } from '../components/Coord';

const emptyForm = {
  shortCode: '',
  name: '',
  department: '',
  about: '',
  designation: '',
};

function AllFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [newFaculty, setNewFaculty] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

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
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const data = await getFacultys(debouncedSearch);
        setFaculty(data.data.faculty);
        setError(null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching faculty.');
        setFaculty([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [debouncedSearch]);

  const notify = (message) => {
    setIsAlertVisible(true);
    setAlertMessage(message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = async (facultyMember) => {
    try {
      const facultyInfo = await getFacultyInfo(facultyMember._id);
      setSelectedFaculty(facultyInfo.data);
      setFormData({
        shortCode: facultyInfo.data.shortCode,
        name: facultyInfo.data.name,
        department: facultyInfo.data.department,
        about: facultyInfo.data.about,
        designation: facultyInfo.data.designation,
      });
    } catch (err) {
      console.error('Error fetching faculty info:', err);
    }
  };

  const handleDelete = async (facultyMember) => {
    try {
      await deleteFaculty(facultyMember._id);
      setFaculty((prev) => prev.filter((f) => f._id !== facultyMember._id));
      notify(`Removed ${facultyMember.name}`);
    } catch (err) {
      console.error('Error deleting faculty:', err);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateFaculty(selectedFaculty._id, formData);
      setSelectedFaculty(null);
      notify('Faculty updated');
    } catch (err) {
      console.error('Error updating faculty:', err);
    }
  };

  const submitNewFaculty = async (e) => {
    e.preventDefault();
    try {
      await addFaculty(formData);
      setNewFaculty(null);
      notify('Faculty added');
    } catch (err) {
      console.error('Error adding new faculty:', err);
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
            Faculty
          </h1>
        </div>
        {!loading && !error && (
          <Coord tone="cyan">
            {faculty.length} {faculty.length === 1 ? 'member' : 'members'}
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
              placeholder="Search faculty by name, code, or department…"
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
            setNewFaculty(true);
          }}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-cyan-400/15 px-5 py-3 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-400/25"
        >
          <CirclePlus className="h-4 w-4" />
          Add faculty
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
                className="h-32 animate-pulse rounded-3xl border border-cyan-400/10 bg-slate-900/40"
              />
            ))}
          </div>
        ) : faculty.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-cyan-400/10 bg-slate-900/40 py-16 text-center">
            <GraduationCap className="h-8 w-8 text-slate-600" />
            <p className="font-semibold uppercase tracking-[0.18em] text-slate-500">
              {search ? `No faculty match “${search}”` : 'No faculty yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {faculty.map((facultyMember) => (
              <div
                key={facultyMember._id}
                className="flex flex-col justify-between gap-6 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-cyan-400/30"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Coord tone="cyan">
                      {facultyMember.shortCode || 'N/A'}
                    </Coord>
                    {facultyMember.designation && (
                      <span className="rounded-full bg-slate-400/10 px-3 py-1 text-[11px] font-semibold text-slate-300">
                        {facultyMember.designation}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-black tracking-tight text-white">
                    {facultyMember.name}
                  </h1>
                  {facultyMember.department && (
                    <p className="mt-1 text-sm text-slate-400">
                      {facultyMember.department}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(facultyMember)}
                    aria-label={`Edit ${facultyMember.name}`}
                    className="flex-1 cursor-pointer rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 text-cyan-400 shadow-lg shadow-cyan-950/20 backdrop-blur-sm transition-colors hover:border-cyan-400/30 hover:text-cyan-300"
                  >
                    <SquarePen className="mx-auto h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(facultyMember)}
                    aria-label={`Delete ${facultyMember.name}`}
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
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Coord tone="cyan">{selectedFaculty.shortCode || 'N/A'}</Coord>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  {selectedFaculty.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedFaculty(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-slate-300">
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Faculty code
                </FieldLabel>
                <Input
                  name="shortCode"
                  value={formData.shortCode}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Faculty name
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
                  Designation
                </FieldLabel>
                <Input
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  About
                </FieldLabel>
                <Textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="rounded-xl border border-cyan-400/20 px-5 py-3 font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW FACULTY FORM */}
      {newFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">Add faculty</h2>
              <button
                onClick={() => setNewFaculty(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-slate-300">
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Faculty code
                </FieldLabel>
                <Input
                  name="shortCode"
                  value={formData.shortCode}
                  placeholder="Ex: MK"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  Faculty name
                </FieldLabel>
                <Input
                  name="name"
                  value={formData.name}
                  placeholder="Ex: Dr. John Doe"
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
                  Designation
                </FieldLabel>
                <Input
                  name="designation"
                  value={formData.designation}
                  placeholder="Ex: Professor"
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-slate-500">
                  About
                </FieldLabel>
                <Textarea
                  name="about"
                  value={formData.about}
                  placeholder="Ex: Dr. John Doe is a professor in the CSE department with expertise in AI and ML."
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setNewFaculty(null)}
                className="rounded-xl border border-cyan-400/20 px-5 py-3 font-semibold text-slate-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={submitNewFaculty}
                className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                Add faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AllFaculty;
