// App.jsx controls the order of the main sections shown on the homepage.
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCoursesSection from "@/components/home/FeaturedCoursesSection";
import FeaturedFacultySection from "@/components/home/FeaturedFacultySection";
import PlatformBenefitsSection from "@/components/home/PlatformBenefitsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import AboutSection from "@/components/home/AboutSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import Footer from "@/components/layout/Footer";
import { Route, Routes } from "react-router";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import FacultyPage from "@/pages/FacultyPage";
import FacultyDetailsPage from "@/pages/FacultyDetailsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import GuestRoute from "@/components/auth/GuestRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import StudentProfilePage from "@/pages/StudentProfilePage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import WriteReviewPage from "@/pages/WriteReviewPage";
import VerifyEmailPage from "@/pages/VerifyEmailPage";

function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedCoursesSection />
      <FeaturedFacultySection />
      <PlatformBenefitsSection />
      <HowItWorksSection />
      <AboutSection />
      <FinalCtaSection />
    </main>
  );
}

function App() {
  return (
    <>
      {/* Shared navigation remains visible across every frontend page. */}
      <Navbar />

      {/* URLs are mapped to page-level React components here. */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        {/* The faculty directory loads its listing from the public faculty API. */}
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/faculty/:facultyId" element={<FacultyDetailsPage />} />
        {/* Authentication pages remain public so signed-out students can enter. */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/reset-password/:token"
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />
        <Route path="/auth/verify-email/:token" element={<VerifyEmailPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/write-review"
          element={
            <ProtectedRoute>
              <WriteReviewPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* The footer appears after all homepage content. */}
      <Footer />
    </>
  );
}

export default App;
