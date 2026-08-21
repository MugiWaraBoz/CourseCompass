import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// page imports
import Home from './pages/home.jsx';
import Dashboard from './pages/dashboard.jsx';
import AllCourses from './pages/allCourse.jsx';
import AllFaculty from './pages/allFaculty.jsx';
import AllModerators from './pages/allModerators.jsx';
import AllReviews from './pages/allReviews.jsx';
import { Layout } from './layouts/pageContainer.jsx';
import AllStudent from './pages/allStudent';

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
      </Routes>
    </Router>
  );
}

export default App;
