import TokenService from "@/services/tokenService";
import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoTo = () => {
        navigate("/login");
        TokenService.removeTokens();
    };
    return (
        <div>
            Pas Autorisé !
            <Button color="primary" size="lg" onClick={handleGoTo}>
                S'authentifié
            </Button>
        </div>
    );
};

export default Unauthorized;
