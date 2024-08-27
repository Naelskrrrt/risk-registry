// contexts/AuthProvider.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import React, {
	createContext,
	ReactNode,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import authService from "../services/authService";
import TokenService from "../services/tokenService";

export type Role = "admin" | "editor" | "user" | "guest";

interface User {
	user_id: number;
	email: string;
	session: string;
	name: string;
	stackholder_title: string;
	role_title: string | null;
	role_id: number;
	token_type: string;
}

interface Credentials {
	session: string;
	password: string;
}

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: User;
}

interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	login: (credentials: Credentials) => Promise<LoginResponse>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<string | void>;
	hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const queryClient = useQueryClient();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const loginMutation = useMutation<LoginResponse, Error, Credentials>({
		mutationFn: async (
			credentials: Credentials
		): Promise<LoginResponse> => {
			const response = await authService.login(credentials);

			const { refresh: accessToken, access: refreshToken } = response;

			const decodeAccessToken = jwtDecode(accessToken) as User;

			const loginResponse: LoginResponse = {
				accessToken: accessToken,
				refreshToken: refreshToken,
				user: decodeAccessToken,
			};
			return loginResponse;
		},
		onSuccess: (data) => {
			TokenService.setAccessToken(data.accessToken);
			TokenService.setRefreshToken(data.refreshToken);
			console.log(data);
			setUser(data.user);
			setIsAuthenticated(true);
			console.log("Login Success", data.user);
			// return <Navigate to="" />;
		},
		onError: (error) => {
			console.log("Login Failed", error);
		},
	});

	const logoutMutation = useMutation<void, Error>({
		mutationFn: async () => {
			await authService.logout();
			setUser(null);
			setIsAuthenticated(false);

			queryClient.clear();
		},
		onError: (error) => {
			console.error("Logout Failed", error);
		},
	});

	const refreshToken = async (): Promise<string | void> => {
		try {
			const accessToken = await authService.refreshAccessToken();
			TokenService.setAccessToken(accessToken);
			const decodeAccessToken = jwtDecode(accessToken) as User;
			setUser(decodeAccessToken);

			queryClient.invalidateQueries({ queryKey: ["v1"] });
			return accessToken;
		} catch (error) {
			// await logoutMutation.mutateAsync();
			console.log(error);
		}
	};

	const login = async (credentials: Credentials): Promise<LoginResponse> => {
		return loginMutation.mutateAsync(credentials);
	};

	const logout = async (): Promise<void> => {
		await logoutMutation.mutateAsync();
	};

	useEffect(() => {
		const storedRefreshToken = TokenService.getRefreshToken();
		if (storedRefreshToken) {
			refreshToken();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const hasRole = (role: Role) => {
		return user?.role_title === role;
	};

	useLayoutEffect(() => {
		const accessToken = TokenService.getAccessToken();
		console.log(accessToken);

		if (accessToken) {
			setUser(jwtDecode(accessToken) as User);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				refreshToken,
				isAuthenticated,
				hasRole,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
