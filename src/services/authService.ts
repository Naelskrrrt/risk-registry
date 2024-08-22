// services/authService.ts
import axios from "axios";
import TokenService from "./tokenService";

interface User {
	id: string;
	username: string;
	// Ajoutez d'autres propriétés si nécessaire
}

interface Credentials {
	username: string;
	password: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

const authService = {
	login: async (credentials: Credentials): Promise<LoginResponse> => {
		const response = await axios.post<LoginResponse>(
			"/api/login",
			credentials
		);
		const { accessToken, refreshToken } = response.data;

		TokenService.setAccessToken(accessToken);
		TokenService.setRefreshToken(refreshToken);

		return response.data;
	},
	logout: async (): Promise<void> => {
		TokenService.removeTokens();
	},
	refreshAccessToken: async (): Promise<string> => {
		const refreshToken = TokenService.getRefreshToken();
		const response = await axios.post<{ accessToken: string }>(
			"/api/refresh",
			{ refreshToken }
		);
		const { accessToken } = response.data;

		TokenService.setAccessToken(accessToken);

		return accessToken;
	},
};

export default authService;
