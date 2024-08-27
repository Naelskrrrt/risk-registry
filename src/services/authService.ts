// services/authService.ts
import TokenService from "./tokenService";
import { apiAuth } from "@/api/apiAuth";

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
        console.log("AuthService: ", response);

        TokenService.setAccessToken(response.data.access);
        TokenService.setRefreshToken(response.data.refresh);

        console.log(
            "tokenService: ",
            TokenService.getAccessToken(),
            TokenService.getRefreshToken()
        );

        // localStorage.setItem("user", "hello");

        return response.data;
    },
    logout: async (): Promise<void> => {
        try {
            const refreshToken = TokenService.getRefreshToken();

            const response = await apiAuth.post("token/blacklist/", {
                refresh: refreshToken,
            });
            console.log("Logout response: ", response);
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
            console.log(response);

            return { access: response.data.access };
        } catch (error) {
            console.log("Refresh Failed", error);
        }
        // Retourner uniquement le jeton d'accès
    },
};

export default authService;
