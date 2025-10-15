import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
    const { user, token, isInitializing } = useAuth();

    if (isInitializing) return null;
    if (!token) return <Navigate to="/login" replace />

    if (roles && !roles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}