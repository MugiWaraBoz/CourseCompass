import {
  SquarePen,
  Trash,
  Search,
  TriangleAlert,
  X,
  CirclePlus,
} from 'lucide-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
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
import { Link } from 'react-router-dom';

function AllFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [newFaculty, setNewFaculty] = useState(null);

  const [formData, setFormData] = useState({
    shortCode: '',
    name: '',
    department: '',
    about: '',
    designation: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400); // Adjust the debounce delay as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount or when search changes
  }, [search]);

  // Fetch faculty whenever the selectedDept, selectedSort, selectedOrder, or debouncedSearch changes
  useEffect(() => {
    const fetchFaculty = async () => {
      let data;
      try {
        data = await getFacultys(debouncedSearch);
        setFaculty(data.data.faculty);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message || 'An error occurred while fetching faculty.');
        setFaculty([]); // Clear faculty on error
      }
    };

    fetchFaculty();
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

  const handleEdit = async (facultyMember) => {
    try {
      const facultyInfo = await getFacultyInfo(facultyMember._id);
      setSelectedFaculty(facultyInfo.data);
      //   console.log(facultyInfo.data.);
      setFormData({
        shortCode: facultyInfo.data.shortCode,
        name: facultyInfo.data.name,
        department: facultyInfo.data.department,
        about: facultyInfo.data.about,
        designation: facultyInfo.data.designation,
      });
    } catch (error) {
      console.error('Error fetching faculty info:', error);
    }
  };

  const handleNewFaculty = () => {
    setNewFaculty({
      shortCode: '',
      name: '',
      department: '',
      about: '',
      designation: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (facultyMember) => {
    try {
      deleteFaculty(facultyMember._id);
      setFaculty((prevFaculty) =>
        prevFaculty.filter((f) => f._id !== facultyMember._id)
      );
      alert('Faculty deleted successfully!');
    } catch (error) {
      console.error('Error deleting faculty:', error);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateFaculty(selectedFaculty._id, formData);
      setSelectedFaculty(null);
      alert('Faculty updated successfully!');
    } catch (error) {
      console.error('Error updating faculty:', error);
    }
  };

  const submitNewFaculty = async (e) => {
    e.preventDefault();
    // implement the logic to submit new faculty data to the server
    try {
      await addFaculty(formData);
      setNewFaculty(null);
      alert('Faculty added successfully!');
    } catch (error) {
      console.error('Error adding new faculty:', error);
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
      <div className="flex flex-row justify-between mx-auto rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
        <Field>
          <input
            className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300"
            placeholder="Search faculty..."
            value={search}
            onChange={handleSearchChange}
          />
        </Field>
        <div>{searchIcon.icon}</div>
        <div>
          <buttons
            onClick={handleNewFaculty}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <CirclePlus className="h-5" />
          </buttons>
        </div>
      </div>

      {/* ALL FACULTY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 mx-auto max-w-8xl py-10 gap-5">
        {error ? (
          <div className="text-red-500 text-2xl bold flex justify-center col-span-full gap-2">
            <span className="">{warningIcon.icon} </span>
            <span className="font-semibold uppercase tracking-[0.22em]">
              {error}
            </span>
          </div>
        ) : (
          faculty.map((facultyMember) => (
            <div
              key={facultyMember._id}
              className="flex flex-row justify-between mb-8 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm"
            >
              {/* FACULTY INFO */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  {facultyMember.shortCode || 'N/A'}
                </p>
                <h1 className="text-2xl font-black tracking-tight text-white lg:text-[1.2rem]">
                  {facultyMember.name}
                </h1>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-4">
                {buttons.map((button) => (
                  <button
                    onClick={() => {
                      if (button.title === 'Edit') {
                        handleEdit(facultyMember);
                      } else if (button.title === 'Delete') {
                        handleDelete(facultyMember);
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

      {/* FACULTY DETAILS / EDIT PANEL */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  {selectedFaculty.shortCode || 'N/A'}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-white">
                  {selectedFaculty.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedFaculty(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 text-gray-300">
              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Faculty Code
                </FieldLabel>
                {/* {console.log(formData)} */}
                <Input
                  name="shortCode"
                  value={`${formData.shortCode}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Faculty Name
                </FieldLabel>
                <Input
                  name="name"
                  value={`${formData.name}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Department
                </FieldLabel>
                <Input
                  name="department"
                  value={`${formData.department}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Designation
                </FieldLabel>
                <Input
                  name="designation"
                  value={`${formData.designation}` || 'N/A'}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-gray-500">About</FieldLabel>
                <Textarea
                  name="about"
                  value={`${formData.about}` || 'N/A'}
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
                  onClick={() => setSelectedFaculty(null)}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Faculty Form */}
      {newFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-2xl rounded-3xl border border-cyan-400/20 bg-slate-900 p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="mt-2 text-3xl font-bold text-white">
                  Add New Faculty
                </h2>
              </div>

              <button
                onClick={() => setNewFaculty(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 text-gray-300">
              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Faculty Code
                </FieldLabel>
                {/* {console.log(formData)} */}
                <Input
                  name="shortCode"
                  value={`${formData.shortCode}`}
                  placeholder="Ex: MK"
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel className="text-sm text-gray-500">
                  Faculty Name
                </FieldLabel>
                <Input
                  name="name"
                  value={`${formData.name}`}
                  placeholder="Ex: Dr. John Doe"
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
                  Designation
                </FieldLabel>
                <Input
                  name="designation"
                  value={`${formData.designation}`}
                  placeholder="Ex: Professor"
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel className="text-sm text-gray-500">About</FieldLabel>
                <Textarea
                  name="about"
                  value={`${formData.about}`}
                  placeholder="Ex: Dr. John Doe is a professor in the CSE department with expertise in AI and ML."
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-4">
              {/* Submit */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={submitNewFaculty}
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  Add
                </button>
              </div>

              {/* Close */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setNewFaculty(null)}
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

export default AllFaculty;
