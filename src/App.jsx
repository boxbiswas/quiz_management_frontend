import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Routing Guards & Layouts
import ProtectedRoute from './components/protectedRoutes';
import AdminLayout from './components/layouts/AdminLayout';
import StudentLayout from './components/layouts/StudentLayout';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserList from './pages/Admin/Users/UserList';
import UserProfile from './pages/Admin/Users/UserProfile';
import QuizList from './pages/Admin/Quizzes/QuizList';
import QuizForm from './pages/Admin/Quizzes/QuizForm';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';

function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* User Management */}
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserProfile />} />
            {/* Quiz Management */}
            <Route path="quizzes" element={<QuizList />} />
            <Route path="quizzes/new" element={<QuizForm />} />
            <Route path="quizzes/:id/edit" element={<QuizForm />} />
            <Route path="categories" element={<AdminDashboard />} />
            <Route path="leaderboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Protected Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            {/* Placeholders for future pages */}
            <Route path="quizzes" element={<StudentDashboard />} />
            <Route path="history" element={<StudentDashboard />} />
            <Route path="leaderboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}

export default App;
