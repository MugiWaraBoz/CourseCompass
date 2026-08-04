import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import FacultyPage from "@/pages/FacultyPage";
import FacultyDetailPage from "@/pages/FacultyDetailPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import EditProfilePage from "@/pages/profile/EditProfilePage";
import MyReviewsPage from "@/pages/profile/MyReviewsPage";
import ChangePasswordPage from "@/pages/profile/ChangePasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";

const protectedPage = (Page) => <ProtectedRoute><Page/></ProtectedRoute>;
const router = createBrowserRouter([{ path: "/", element: <AppLayout/>, children: [
  { index: true, element: <HomePage/> },
  { path: "courses", element: <CoursesPage/> }, { path: "courses/:id", element: <CourseDetailPage/> },
  { path: "faculty", element: <FacultyPage/> }, { path: "faculty/:id", element: <FacultyDetailPage/> },
  { path: "auth/login", element: <LoginPage/> }, { path: "auth/register", element: <RegisterPage/> },
  { path: "auth/forgot-password", element: <ForgotPasswordPage/> }, { path: "auth/reset-password/:token", element: <ResetPasswordPage/> },
  { path: "profile", element: protectedPage(ProfilePage) }, { path: "profile/edit", element: protectedPage(EditProfilePage) },
  { path: "profile/reviews", element: protectedPage(MyReviewsPage) }, { path: "profile/password", element: protectedPage(ChangePasswordPage) },
  { path: "*", element: <NotFoundPage/> },
]}]);

export default function App() { return <RouterProvider router={router}/>; }
