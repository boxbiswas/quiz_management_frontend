import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. If the route specifies allowed roles, check if the user has permission
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If they don't have permission, redirect them to their respective dashboard
        if (user?.role === 'ADMIN') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/student/dashboard" replace />;
    }

    // 3. If they are authenticated and have the right role, render the requested page
    return <Outlet />;
}