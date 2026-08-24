import { Search } from 'lucide-react';

import { useEffect, useState } from 'react';
import { Field } from '@/components/ui/field';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { getAllStudent } from '@/api/studentApi';
import { getCourses } from '@/api/courseApi';
import { getFacultys } from '@/api/facultyApi';

function AllReviews() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [searchStudent, setSearchStudent] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [searchFaculty, setSearchFaculty] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch students, courses, faculties, and reviews from the API
    const fetchData = async () => {
      try {
        const studentsData = await getAllStudent(searchStudent);
        setStudents(studentsData.data.students);

        const coursesData = await getCourses(searchCourse);
        setCourses(coursesData.data.courses);

        const facultiesData = await getFacultys(searchFaculty);
        setFaculties(facultiesData.data.faculty);

        setError(null); // Clear any previous errors
      } catch (error) {
        setError(error.message || 'Unable to load data. Please try again.');
      }
    };

    fetchData();
  }, [searchStudent, searchCourse, searchFaculty]);

  const handleStudentClick = async (studentId) => {
    navigate(`/reviews/student/${studentId}`);
  };
  // console.log("student reviews:", studentReviews);
  const handleCourseClick = async (courseId) => {
    // Handle course click logic here
    navigate(`/reviews/course/${courseId}`);
  };

  const handleFacultyClick = async (facultyId) => {
    navigate(`/reviews/faculty/${facultyId}`);
  };

  return (
    <Tabs defaultValue="overview" className="p-8">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="student-reviews">Student Reviews</TabsTrigger>
        <TabsTrigger value="course-reviews">Course Reviews</TabsTrigger>
        <TabsTrigger value="faculty-reviews">Faculty Reviews</TabsTrigger>
      </TabsList>
      <div>
        {/* For student reviews */}
        <TabsContent value="student-reviews" className="grid grid-cols-1">
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}
          {/* Search Field */}
          <div className="flex flex-col gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:flex-row sm:items-center">
            <Field className="flex-1">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-400/60" />
                <input
                  className="w-full bg-transparent py-3 pr-10 pl-11 text-sm font-semibold tracking-wide text-cyan-100 placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
                  placeholder="Search students by name or ID…"
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                />
              </div>
            </Field>
          </div>
          {/* {console.log(students)} */}
          {/* transparent color, backgound can be seen */}

          <div className="grid grid-cols-3 mt-4 gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
            {/* <div className="flex items-center justify-between px-3 py-2"> */}
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              ID
            </div>
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Name
            </div>
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Reviews
            </div>
            {/* </div> */}

            {students.length > 0 ? (
              students.map((student) => (
                <div
                  className="grid col-span-3 py-2 hover:bg-slate-700 cursor-pointer"
                  key={student._id}
                  onClick={() => handleStudentClick(student._id)}
                >
                  <div className="grid grid-cols-3">
                    <div>{student.studentIdNumber}</div>
                    <div>{student.name}</div>
                    <div>{student.reviewCount}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                {error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className="text-muted-foreground">
                    No Student data available.
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        {/* For course reviews */}
        <TabsContent value="course-reviews" className="grid grid-cols-1">
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}
          {/* Search Field */}
          <div className="flex flex-col gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:flex-row sm:items-center">
            <Field className="flex-1">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-400/60" />
                <input
                  className="w-full bg-transparent py-3 pr-10 pl-11 text-sm font-semibold tracking-wide text-cyan-100 placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
                  placeholder="Search courses by name or ID…"
                  value={searchCourse}
                  onChange={(e) => setSearchCourse(e.target.value)}
                />
              </div>
            </Field>
          </div>
          {/* {console.log(students)} */}
          {/* transparent color, backgound can be seen */}

          <div className="grid grid-cols-3 mt-4 gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
            {/* <div className="flex items-center justify-between px-3 py-2"> */}
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Code
            </div>
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Name
            </div>
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Reviews
            </div>
            {/* </div> */}

            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  className="grid col-span-3 py-2 hover:bg-slate-700 cursor-pointer"
                  key={course._id}
                  onClick={() => handleCourseClick(course._id)}
                >
                  <div className="grid grid-cols-3">
                    <div>{course.code}</div>
                    <div>{course.name}</div>
                    <div>{course.reviewCount}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                {error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className="text-muted-foreground">
                    No Course data available.
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        {/* for Faculty reviews */}
        <TabsContent value="faculty-reviews" className="grid grid-cols-1">
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}
          {/* Search Field */}
          <div className="flex flex-col gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:flex-row sm:items-center">
            <Field className="flex-1">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cyan-400/60" />
                <input
                  className="w-full bg-transparent py-3 pr-10 pl-11 text-sm font-semibold tracking-wide text-cyan-100 placeholder:font-normal placeholder:text-slate-500 focus:outline-none"
                  placeholder="Search faculties by name or ID…"
                  value={searchFaculty}
                  onChange={(e) => setSearchFaculty(e.target.value)}
                />
              </div>
            </Field>
          </div>
          {/* {console.log(faculties)} */}
          {/* transparent color, backgound can be seen */}

          <div className="grid grid-cols-3 mt-4 gap-3 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
            {/* <div className="flex items-center justify-between px-3 py-2"> */}
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Code
            </div>
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Name
            </div>
            <div className="text-cyan-500 font-bold uppercase tracking-[0.1em]">
              Reviews
            </div>
            {/* </div> */}

            {faculties.length > 0 ? (
              faculties.map((faculty) => (
                <div
                  className="grid col-span-3 py-2 hover:bg-slate-700 cursor-pointer"
                  key={faculty._id}
                  onClick={() => handleFacultyClick(faculty._id)}
                >
                  <div className="grid grid-cols-3">
                    <div>{faculty.shortCode}</div>
                    <div>{faculty.name}</div>
                    <div>{faculty.reviewCount}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-64">
                {error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <div className="text-muted-foreground">
                    No Faculty data available.
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default AllReviews;
