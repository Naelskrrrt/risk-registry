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
        const { access: accessToken, refresh: refreshToken } = response.data;
        console.log(accessToken, refreshToken);

        TokenService.setAccessToken(accessToken);
        TokenService.setRefreshToken(refreshToken);

        console.log(
            "tokenService: ",
            TokenService.getAccessToken(),
            TokenService.getRefreshToken()
        );

        localStorage.setItem("user", "hello");

        return response.data;
    },
    logout: async (): Promise<{ message: string }> => {
        const refreshToken = TokenService.getRefreshToken();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await apiAuth.post<{ accessToken: string }>(
            "token/blacklist/",
            { refresh: refreshToken }
        );

        return { message: "Déconnexion réussie" };
    },
    refreshAccessToken: async (): Promise<string> => {
        const refreshToken = TokenService.getRefreshToken();
        console.log("RefreshToken: ", refreshToken);
        const response = await apiAuth.post<{ accessToken: string }>(
            "token/refresh/",
            { refresh: refreshToken }
        );
        const { accessToken } = response.data;

        TokenService.setAccessToken(accessToken);

        return accessToken;
    },
};

export default authService;
