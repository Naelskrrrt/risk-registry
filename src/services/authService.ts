/* eslint-disable react-hooks/rules-of-hooks */
// services/authService.ts
import { useNavigate } from "react-router-dom";
import TokenService from "./tokenService";
import { apiAuth } from "@/api/apiAuth";
import { toast } from "sonner";

interface User {
    id: string;
    username: string;
}

interface Credentials {
    session: string;
    password: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

const authService = {
    login: async (credentials: Credentials): Promise<LoginResponse> => {
        const response = await apiAuth.post<LoginResponse>(
            "/login/",
            credentials
        );

        TokenService.setAccessToken(response.data.access);
        TokenService.setRefreshToken(response.data.refresh);

        // localStorage.setItem("user", "hello");

        return response.data;
    },
    logout: async (): Promise<void> => {
        try {
            const refreshToken = TokenService.getRefreshToken();

            const response = await apiAuth.post("token/blacklist/", {
                refresh: refreshToken,
            });
            return response.data;
        } catch (error) {
            console.log("Logout Failed", error);
        }
    },
    refreshAccessToken: async (): Promise<{ access: string } | undefined> => {
        try {
            const refreshToken = TokenService.getRefreshToken();
            const response = await apiAuth.post<LoginResponse>(
                "token/refresh/",
                {
                    refresh: refreshToken,
                }
            );

            return { access: response.data.access };
        } catch (error) {
            const navigation = useNavigate();
            navigation("/login");
            toast.error("Vous etes Déconnécté !", {
                description: "Veuillez vous reconnécter pour continuer !",
            });
            console.log("Refresh Error: ", error);
        }
        // Retourner uniquement le jeton d'accès
    },
};

export default authService;
