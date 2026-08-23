import UnderDevelopment from '@/components/common/UnderDevelopment';
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
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { getAllStudent } from '@/api/studentApi';
import { getCourses } from '@/api/courseApi';
import { getFacultys } from '@/api/facultyApi';
import {
  getAllStudentReviews,
  getAllCourseReviews,
  getAllFacultyReviews,
} from '@/api/reviewApi';

function AllReviews() {

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [studentReviews, setStudentReviews] = useState([]);
  const [courseReviews, setCourseReviews] = useState([]);
  const [facultyReviews, setFacultyReviews] = useState([]);
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
      <TabsContent value="student-reviews" className="grid grid-cols-1">
        {error && (
        <div className="text-red-500 text-center py-4">{error}</div>
        )}
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
        {students.length > 0 ? (
          students.map((student) => (
          <Card className="rounded-none" onClick={()=>handleStudentClick(student._id)}>
          <CardHeader>
            <CardTitle>{student.name}</CardTitle>
            <CardDescription>
              View your key metrics and recent project activity. Track progress
              across all your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You have 12 active projects and 3 pending tasks.
          </CardContent>
          </Card>
          ))
        ):(
          <div className="flex items-center justify-center h-64">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="text-muted-foreground">No Student data available.</div>
            )}
          </div>
        )}
        
      </TabsContent>
      <TabsContent value="course-reviews" className="grid grid-cols-1">
        
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
        {/* {console.log(courses)} */}
        {courses.length > 0 || error ? (
          courses.map((course) => (
          <Card className="rounded-none" onClick={()=>handleCourseClick(course._id)}>
          <CardHeader>
            <CardTitle>{course.name}</CardTitle>
            <CardDescription>
              View your key metrics and recent project activity. Track progress
              across all your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You have 12 active projects and 3 pending tasks.
          </CardContent>
          </Card>
          ))
        ):(
          <div className="flex items-center justify-center h-64">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="text-muted-foreground">No Course data available.</div>
            )}
          </div>
        )}
      </TabsContent>
      <TabsContent value="faculty-reviews" className="grid grid-cols-1">
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
        {faculties.length > 0 || error ? (
          faculties.map((faculty) => (
          <Card className="rounded-none" onClick={()=>handleFacultyClick(faculty._id)}>
          <CardHeader>
            <CardTitle>{faculty.name}</CardTitle>
            <CardDescription>
              View your key metrics and recent project activity. Track progress
              across all your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            You have 12 active projects and 3 pending tasks.
          </CardContent>
          </Card>
          ))
        ):(
          <div className="flex items-center justify-center h-64">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="text-muted-foreground">No Faculty data available.</div>
            )}
          </div>
        )}
      </TabsContent>
      </div>
    </Tabs>
  );
}

export default AllReviews;
