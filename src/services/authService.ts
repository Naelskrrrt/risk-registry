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
        console.log(response);
        const { access: accessToken, refresh: refreshToken } = response.data;
        console.log(accessToken);

        TokenService.setAccessToken(accessToken);
        TokenService.setRefreshToken(refreshToken);

        console.log(response.data);
        return response.data;
    },
    logout: async (): Promise<void> => {
        TokenService.removeTokens();
    },
    refreshAccessToken: async (): Promise<string> => {
        const refreshToken = TokenService.getRefreshToken();
        const response = await apiAuth.post<{ accessToken: string }>(
            "/refresh/",
            { refreshToken }
        );
        const { accessToken } = response.data;

        TokenService.setAccessToken(accessToken);

        return accessToken;
    },
};

export default authService;
