import { Role, useAuth } from "@/context/AuthProvider";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({
    children,
    roles,
}: {
    children: React.ReactNode;
    roles: Role[];
}) => {
    const { hasRole, user } = useAuth();
    if (user) {
        if (roles.some((role) => hasRole(role))) {
            return <Outlet />;
        } else {
            return <Navigate to={"/unauthorized"} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
