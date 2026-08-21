import {
  Trash,
  Search,
  TriangleAlert,
  Check,
  MailCheck,
  BadgeCheck,
  Image,
  SquareOff,
  X,
  BadgeInfoIcon,
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

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

import { useEffect, useState } from 'react';
import {
  getAllStudent,
  deleteStudent,
  changeVerifyStatus,
} from '../api/studentApi';

function AllStudent() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // Adjust the debounce delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount or when search changes
  }, [search]);

  useEffect(() => {
    if (!alertMessage) {
      return;
    }

    const hideTimer = setTimeout(() => setIsAlertVisible(false), 2700);
    const removeTimer = setTimeout(() => setAlertMessage(null), 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [alertMessage]);

  // Fetch faculty whenever the selectedDept, selectedSort, selectedOrder, or debouncedSearch changes
  useEffect(() => {
    const fetchStudents = async () => {
      let data;
      try {
        data = await getAllStudent(debouncedSearch);
        setStudents(data.data.students);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message || 'An error occurred while fetching students.');
        setStudents([]); // Clear students on error
      }
    };

    fetchStudents();
  }, [debouncedSearch]);

  const buttons = [
    {
      title: 'Delete',
      icon: <Trash className="h-5" />,
      color: 'text-red-400 hover:text-red-300',
    },
  ];

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDelete = async (student) => {
    try {
      await deleteStudent(student._id);
      // Remove the deleted student from the state
      setStudents((prevStudents) =>
        prevStudents.filter((s) => s._id !== student._id)
      );
      setIsAlertVisible(true);
      setAlertMessage(`Student deleted: ${student.name}`);
    } catch (err) {
      setError(err.message || 'An error occurred while deleting the student.');
    }
  };

  const handleVerifyStudent = async (student) => {
    try {
      await changeVerifyStatus(student._id, true);
      // Update the verification status in the state
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s._id === student._id ? { ...s, verified: true } : s
        )
      );
      setIsAlertVisible(true);
      setAlertMessage(`Student verified: ${student.name}`);
    } catch (err) {
      setError(err.message || 'An error occurred while verifying the student.');
    }
  };

  const handleRemoveVerification = async (student) => {
    try {
      await changeVerifyStatus(student._id, false);
      // Update the verification status in the state
      setStudents((prevStudents) =>
        prevStudents.map((s) =>
          s._id === student._id ? { ...s, verified: false } : s
        )
      );
      setIsAlertVisible(true);
      setAlertMessage(`Verification removed for student: ${student.name}`);
    } catch (err) {
      setError(
        err.message ||
          "An error occurred while removing the student's verification."
      );
    }
  };

  const searchIcon = {
    title: 'Search',
    icon: <Search className="h-5" />,
    color: 'text-green-400 hover:text-green-300',
  };

  const warningIcon = {
    title: 'Warning',
    icon: <TriangleAlert className="h-06" />,
  };

  return (
    <section className="gap-4 mx-auto max-w-8xl px-6 py-10">
      {alertMessage && (
        <div className="fixed top-4 right-4 z-9999 w-96">
          <Alert
            className={`shadow-2xl transition-opacity duration-300 bg-slate-800/80 text-slate-300 border border-cyan-400/30 ${
              isAlertVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <BadgeInfoIcon className="h-4 w-4 text-slate-300" />
            <AlertTitle className="font-black">Action Completed</AlertTitle>
            <AlertDescription className="text-slate-300">
              {alertMessage}
            </AlertDescription>
            <AlertAction
              onClick={() => {
                setIsAlertVisible(false);
                setTimeout(() => setAlertMessage(null), 300);
              }}
            >
              <X className="h-4 w-4 text-slate-300" />
            </AlertAction>
          </Alert>
        </div>
      )}
      <div className="flex flex-row justify-between mx-auto rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
        <Field>
          <input
            className="font-semibold uppercase tracking-[0.22em] text-cyan-300"
            placeholder="Search students..."
            value={search}
            onChange={handleSearchChange}
          />
        </Field>
        <div>{searchIcon.icon}</div>
      </div>

      {/* ALL STUDENT */}
      <div className="grid grid-cols-1 mx-auto max-w-8xl py-10 gap-5">
        {error ? (
          <div className="text-red-500 text-2xl bold flex justify-center col-span-full gap-2">
            <span className="">{warningIcon.icon} </span>
            <span className="font-semibold uppercase tracking-[0.22em]">
              {error}
            </span>
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student._id}
              className="mb-5 flex flex-col gap-6 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-400/15 text-xl font-black text-cyan-200 ring-1 ring-cyan-300/30">
                  {student.name?.charAt(0).toUpperCase() || '?'}
                </div>

                <div className="min-w-0">
                  <p className="mb-1 truncate text-xl font-black tracking-tight text-white">
                    {student.name || 'Unnamed student'}
                  </p>
                  <p className="truncate text-sm text-slate-300">
                    {student.email || 'No email provided'}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    ID: {student.studentIdNumber || 'N/A'}
                  </p>
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

              {/* BUTTONS */}
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-cyan-400 hover:text-cyan-300 mx-2 cursor-pointer"
                    >
                      <div
                        className={`rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 shadow-lg shadow-cyan-950/20 backdrop-blur-sm`}
                      >
                        <Image className="h-5" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-950/60 backdrop-blur-sm shadow-2xl shadow-cyan-950/20">
                    <DialogHeader>
                      <DialogTitle className="text-cyan-300 underline text-2xl uppercase tracking-[0.22em] font-black">
                        Student Image
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      {console.log(student.photoUrl)}
                      {student.photoUrl ? (
                        <div className="flex flex-col items-start gap-2">
                          <a
                            href={student.photoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline font-black text-2xl"
                          >
                            Photo URL
                          </a>
                          <span className="text-xs text-muted-foreground">
                            {student.photoUrl}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start gap-2">
                          <SquareOff className="h-10 w-10 text-muted-foreground" />
                          <p>No image available.</p>
                        </div>
                      )}
                    </DialogDescription>
                    <DialogFooter>
                      {!student.verified ? (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-muted-foreground">
                            Student is not yet verified
                          </span>
                          <button
                            type="button"
                            onClick={() => handleVerifyStudent(student)}
                            className="justify-center cursor-pointer inline-flex items-center gap-1 rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/25"
                          >
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Verify Student
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-muted-foreground">
                            Student is verified
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVerification(student)}
                            className="justify-center cursor-pointer inline-flex items-center gap-1 rounded-full bg-red-400/15 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-400/25"
                          >
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Remove Verification
                          </button>
                        </div>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {buttons.map((button) => (
                  <button
                    key={button.title}
                    type="button"
                    title={button.title}
                    aria-label={`${button.title} ${student.name || 'student'}`}
                    onClick={() => {
                      if (button.title === 'Delete') {
                        handleDelete(student);
                      }
                    }}
                    className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <div
                      className={`rounded-xl border border-cyan-400/15 bg-slate-950/50 p-3 shadow-lg shadow-cyan-950/20 backdrop-blur-sm ${button.color}`}
                    >
                      {button.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default AllStudent;
