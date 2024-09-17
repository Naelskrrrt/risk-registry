import { useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    console.log(user);
    useEffect(() => {
        if (user) {
            switch (user.role_id) {
                case 1:
                    navigate("/dashboard/admin", { replace: true });
                    break;
                case 3:
                    navigate("/dashboard/risk_ia", { replace: true });
                    break;
                case 2:
                    navigate("/dashboard/risk_it", { replace: true });
                    break;
                case 4:
                    navigate("/home", { replace: true });
                    break;
                default:
                    navigate("/", { replace: true });
                    break;
            }
        }
    }, [user, navigate]);
};

export default useAuthRedirect;
