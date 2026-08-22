import {
  SquarePen,
  Trash,
  Search,
  TriangleAlert,
  X,
  CirclePlus,
  BadgeInfoIcon,
} from 'lucide-react';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

import { Input } from '@/components/ui/input';

import { useEffect, useState } from 'react';
import {
  getCourses,
  getCourseInfo,
  updateCourse,
  deleteCourse,
  addCourse,
} from '../api/courseApi';

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [newCourse, setNewCourse] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    credit: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // Adjust the debounce delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount or when search changes
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

  // Fetch courses whenever the selectedDept, selectedSort, selectedOrder, or debouncedSearch changes
  useEffect(() => {
    const fetchCourses = async () => {
      let data;
      try {
        data = await getCourses(debouncedSearch);
        setCourses(data.data.courses);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message || 'An error occurred while fetching courses.');
        setCourses([]); // Clear courses on error
      }
    };

    fetchCourses();
  }, [debouncedSearch]);

  const buttons = [
    {
      title: 'Edit',
      icon: <SquarePen className="h-5" />,
      color: 'text-cyan-400 hover:text-cyan-300',
    },
    {
      title: 'Delete',
      icon: <Trash className="h-5" />,
      color: 'text-red-400 hover:text-red-300',
    },
  ];

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
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
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  };

  const handleNewCourse = () => {
    setNewCourse({
      code: '',
      name: '',
      department: '',
      credit: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (course) => {
    // Implement delete functionality here
    try {
      await deleteCourse(course._id);
      setCourses((prevCourses) =>
        prevCourses.filter((c) => c._id !== course._id)
      );
      setIsAlertVisible(true);
      setAlertMessage('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(selectedCourse._id, formData);
      setSelectedCourse(null);
      setIsAlertVisible(true);
      setAlertMessage('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const submitNewCourse = async (e) => {
    e.preventDefault();
    // implement the logic to submit new course data to the server
    try {
      await addCourse(formData);
      setNewCourse(null);
      // message to user that course has been added successfully
      setIsAlertVisible(true);
      setAlertMessage('Course added successfully!');
    } catch (error) {
      console.error('Error adding new course:', error);
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
            placeholder="Search courses..."
            value={search}
            onChange={handleSearchChange}
          />
        </Field>
        <div>{searchIcon.icon}</div>
        <div>
          <button onClick={handleNewCourse}>
            <CirclePlus className="h-5" />
          </button>{' '}
        </div>
      </div>

      {/* ALL COURSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto max-w-8xl py-10 gap-5">
        {error ? (
          <div className="text-red-500 text-2xl bold flex justify-center col-span-full gap-2">
            <span className="">{warningIcon.icon} </span>
            <span className="font-semibold uppercase tracking-[0.22em]">
              {error}
            </span>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="flex flex-col lg:flex-row justify-between mb-8 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm"
            >
              {/* COURSE INFO */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  {course.code}
                </p>
                <h1 className="text-2xl font-black tracking-tight text-white lg:text-[1.2rem]">
                  {course.name}
                </h1>
              </div>

              {/* BUTTONS */}
              <div className="flex mt-4 lg:mt-0 gap-4">
                {buttons.map((button) => (
                  <button
                    onClick={() => {
                      if (button.title === 'Edit') {
                        handleEdit(course);
                      } else if (button.title === 'Delete') {
                        handleDelete(course);
                      }
                    }}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <div
                      className={`rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm ${button.color}`}
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

      {/* COURSE DETAILS / EDIT PANEL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  {selectedCourse.code}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {selectedCourse.name}
                </h2>
              </div>

              {/* <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6" />
              </button> */}
            </div>

            {/* Details */}
            <div className="space-y-4 text-gray-300">
              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Course Code
                </FieldLabel>
                <Input
                  name="code"
                  placeholder={`${formData.code}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Course Name
                </FieldLabel>
                <Input
                  name="name"
                  placeholder={`${formData.name}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Department
                </FieldLabel>
                <Input
                  name="department"
                  placeholder={`${formData.department}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Credits
                </FieldLabel>
                <Input
                  name="credit"
                  placeholder={`${formData.credit}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-4">
              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={submitEdit}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  Submit
                </button>
              </div>

              {/* Close */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Course Form */}
      {newCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Add New Course
                </h2>
              </div>

              <button
                onClick={() => setNewCourse(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 text-gray-300">
              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Course Code
                </FieldLabel>
                {/* {console.log(formData)} */}
                <Input
                  name="code"
                  value={`${formData.code}`}
                  placeholder="Ex: CSE101"
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Course Name
                </FieldLabel>
                <Input
                  name="name"
                  value={`${formData.name}`}
                  placeholder="Ex: Data Structures"
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Department
                </FieldLabel>
                <Input
                  name="department"
                  value={`${formData.department}`}
                  placeholder="Ex: CSE"
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Credits
                </FieldLabel>
                <Input
                  name="credit"
                  type="text"
                  value={`${formData.credit}`}
                  placeholder="Ex: 3"
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-4">
              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={submitNewCourse}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  Add
                </button>
              </div>

              {/* Close */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setNewCourse(null)}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AllCourses;
