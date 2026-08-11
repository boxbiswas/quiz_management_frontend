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
import QuestionsList from './pages/Admin/Quizzes/QuestionsList';
import QuestionForm from './pages/Admin/Quizzes/QuestionForm';
import CategoryList from './pages/Admin/Categories/CategoryList';
import CategoryForm from './pages/Admin/Categories/CategoryForm';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentQuizList from './pages/Student/Quizzes/QuizList';
import StudentQuizDetails from './pages/Student/Quizzes/QuizDetails';
import StudentTakeQuiz from './pages/Student/Quizzes/TakeQuiz';
import StudentQuizResults from './pages/Student/Quizzes/QuizResults';
import StudentHistory from './pages/Student/History';

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
            
            {/* Question Management */}
            <Route path="quizzes/:quizId/questions" element={<QuestionsList />} />
            <Route path="quizzes/:quizId/questions/new" element={<QuestionForm />} />
            <Route path="quizzes/:quizId/questions/:questionId/edit" element={<QuestionForm />} />
            
            {/* Category Management */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />

            <Route path="leaderboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            
            {/* Student Quizzes */}
            <Route path="quizzes" element={<StudentQuizList />} />
            <Route path="quizzes/:id" element={<StudentQuizDetails />} />
            <Route path="quizzes/:id/take" element={<StudentTakeQuiz />} />
            <Route path="attempts/:id/results" element={<StudentQuizResults />} />
            
            <Route path="history" element={<StudentHistory />} />
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
