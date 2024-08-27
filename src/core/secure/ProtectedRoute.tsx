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
	console.log("User object:", user);
	console.log("User role title:", user?.role_title);
	console.log("Allowed roles:", allowedRoles);
	console.log(
		"Role match:",
		allowedRoles.includes(user?.role_title as string)
	);
	console.log("Should redirect to login:", !user);
	console.log(
		"Should redirect to unauthorized:",
		user && !allowedRoles.includes(user?.role_title as string)
	);

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
