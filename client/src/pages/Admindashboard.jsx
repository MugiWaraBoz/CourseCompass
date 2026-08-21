import {
  BookOpen,
  GraduationCap,
  Users,
  MailCheck,
  MailX,
  BadgeCheck,
  BadgeX,
  BadgePercent,
  UserStar,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  fetchStudentStatus,
  fetchCourseStatus,
  fetchFacultyStatus,
  fetchReviewStatus,
} from '../api/statusApi';
import LivePing from '../components/livePing';

function Dashboard() {
  const [studentStatus, setStudentStatus] = useState(null);
  const [courseStatus, setCourseStatus] = useState(null);
  const [facultyStatus, setFacultyStatus] = useState(null);
  const [reviewStatus, setReviewStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const studentData = await fetchStudentStatus();
        setStudentStatus(studentData.data);

        const courseData = await fetchCourseStatus();
        setCourseStatus(courseData.data);

        const facultyData = await fetchFacultyStatus();
        setFacultyStatus(facultyData.data);

        const reviewData = await fetchReviewStatus();
        setReviewStatus(reviewData.data);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, []);

  const stats = [
    {
      label: 'Total courses',
      value: courseStatus ? courseStatus.totalCourses : 'Loading...',
      icon: BookOpen,
      tone: 'text-cyan-300',
    },
    {
      label: 'Faculty members',
      value: facultyStatus ? facultyStatus.totalFaculty : 'Loading...',
      icon: GraduationCap,
      tone: 'text-emerald-300',
    },
    {
      label: 'Total students',
      value: studentStatus ? studentStatus.totalStudents : 'Loading...',
      icon: Users,
      tone: 'text-amber-300',
    },
  ];
  // console.log('Student Status:', studentStatus);
  const studentStats = [
    {
      label: 'Verified students',
      value: studentStatus ? studentStatus.verifiedStudents : 'Loading...',
      icon: BadgeCheck,
      tone: 'text-emerald-300',
    },
    {
      label: 'Unverified students',
      value: studentStatus ? studentStatus.unverifiedStudents : 'Loading...',
      icon: BadgeX,
      tone: 'text-red-300',
    },
    {
      label: 'Percentage of verified students',
      value: studentStatus
        ? studentStatus.verifiedStudentPercentage
        : 'Loading...',
      icon: BadgePercent,
      tone: 'text-amber-300',
    },
  ];

  const reviewStats = [
    {
      label: 'Total reviews',
      value: reviewStatus ? reviewStatus.totalReviews : 'Loading...',
      icon: UserStar,
      tone: 'text-emerald-300',
    },
    {
      label: '5-star reviews',
      value: reviewStatus ? reviewStatus.fiveStarReviews : 'Loading...',
      icon: Star,
      tone: 'text-emerald-300',
    },
    {
      label: '4-star reviews',
      value: reviewStatus ? reviewStatus.fourStarReviews : 'Loading...',
      icon: Star,
      tone: 'text-amber-300',
    },
    {
      label: '3-star reviews',
      value: reviewStatus ? reviewStatus.threeStarReviews : 'Loading...',
      icon: Star,
      tone: 'text-amber-300',
    },
    {
      label: '2-star reviews',
      value: reviewStatus ? reviewStatus.twoStarReviews : 'Loading...',
      icon: Star,
      tone: 'text-red-300',
    },
    {
      label: '1-star reviews',
      value: reviewStatus ? reviewStatus.oneStarReviews : 'Loading...',
      icon: Star,
      tone: 'text-red-300',
    },
  ];

  const studentMailVerifiedStatus = [
    {
      label: 'Mail verified students',
      value: studentStatus ? studentStatus.activeStudents : 'Loading...',
      icon: MailCheck,
      tone: 'text-amber-300',
    },
    {
      label: 'Mail unverified students',
      value: studentStatus ? studentStatus.inactiveStudents : 'Loading...',
      icon: MailX,
      tone: 'text-red-300',
    },
    {
      label: 'Percentage of mail verified students',
      value: studentStatus
        ? studentStatus.activeStudentPercentage
        : 'Loading...',
      icon: BadgePercent,
      tone: 'text-amber-300',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-3xl border border-cyan-400/15 bg-slate-900/60 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Overview
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            CourseCompass Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-semibold text-emerald-300 sm:self-auto">
          <LivePing h="3" w="3" />
          Live
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 my-12">
        <div className="text-2xl font-black tracking-tight text-white md:text-3xl col-span-full">
          <div className="flex items-center gap-4">
            Overview
            <LivePing h="5" w="5" />
          </div>
        </div>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 transition-colors hover:border-cyan-400/25"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon className={`h-5 w-5 ${item.tone}`} />
              </div>
              <p className="text-4xl font-black tracking-tight text-white">
                {item.value}
              </p>
              <div
                className={`mt-4 h-1 w-10 rounded-full bg-current opacity-60 ${item.tone}`}
              />
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3 my-12">
        <div className="text-2xl font-black tracking-tight text-white md:text-3xl col-span-full">
          <div className="flex items-center gap-4">
            Student Statistics
            <LivePing h="5" w="5" />
          </div>
        </div>
        {studentStats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 transition-colors hover:border-cyan-400/25"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon className={`h-5 w-5 ${item.tone}`} />
              </div>
              <p className="text-4xl font-black tracking-tight text-white">
                {item.value}
              </p>
              <div
                className={`mt-4 h-1 w-10 rounded-full bg-current opacity-60 ${item.tone}`}
              />
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3 ">
        {studentMailVerifiedStatus.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 transition-colors hover:border-cyan-400/25"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon className={`h-5 w-5 ${item.tone}`} />
              </div>
              <p className="text-4xl font-black tracking-tight text-white">
                {item.value}
              </p>
              <div
                className={`mt-4 h-1 w-10 rounded-full bg-current opacity-60 ${item.tone}`}
              />
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3 my-12">
        <div className="mt-8 text-2xl font-black tracking-tight text-white md:text-3xl col-span-full">
          <div className="flex items-center gap-4">
            Review Statistics
            <LivePing h="5" w="5" />
          </div>
        </div>
        {reviewStats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 transition-colors hover:border-cyan-400/25"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-slate-400">{item.label}</p>
                <Icon className={`h-5 w-5 ${item.tone}`} />
              </div>
              <p className="text-4xl font-black tracking-tight text-white">
                {item.value}
              </p>
              <div
                className={`mt-4 h-1 w-10 rounded-full bg-current opacity-60 ${item.tone}`}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Dashboard;
