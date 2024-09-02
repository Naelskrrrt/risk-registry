import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			switch (user.role_title) {
				case "ADMIN":
					navigate("/dashboard/admin", { replace: true });
					break;
				case "RRA":
					navigate("/dashboard/risk-assessment", { replace: true });
					break;
				case "RIT":
					navigate("/dashboard/risk-it", { replace: true });
					break;
				case "VISITEUR":
					navigate("/home", { replace: true });
					break;
				default:
					navigate("/unauthorized", { replace: true });
					break;
			}
		}
	}, [user, navigate]);
};

export default useAuthRedirect;
