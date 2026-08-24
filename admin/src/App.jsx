import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// page imports
import Home from './pages/Adminhome.jsx';
import Dashboard from './pages/Admindashboard.jsx';
import AllCourses from './pages/allCourse.jsx';
import AllFaculty from './pages/allFaculty.jsx';
import AllModerators from './pages/allModerators.jsx';
import AllReviews from './pages/allReviews.jsx';
import NotFound from './pages/NotFound.jsx';
import AllStudent from './pages/allStudent';
import StudentReviews from './pages/StudentReviews.jsx';
import CourseReviews from './pages/CourseReviews.jsx';
import FacultyReviews from './pages/FacultyReviews.jsx';
import { Layout } from './layouts/pageContainer.jsx';

function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Layout>
                <AllCourses />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <ProtectedRoute>
              <Layout>
                <AllFaculty />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Layout>
                <AllStudent />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Layout>
                <AllReviews />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderators"
          element={
            <ProtectedRoute>
              <Layout>
                <AllModerators />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews/student/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <StudentReviews />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews/course/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <CourseReviews />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews/faculty/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <FacultyReviews />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
