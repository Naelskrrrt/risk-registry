import { useAuth } from "@/context/AuthProvider";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
}) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role_title as string)) {
        return (
            <Navigate to="/unauthorized" state={{ from: location }} replace />
        );
    }

    return <>{children}</>;
};
export default ProtectedRoute;
