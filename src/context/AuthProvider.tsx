// contexts/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/authService";
import TokenService from "../services/tokenService";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface User {
	id: string;
	username: string;

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

interface AuthContextType {
	user: User | null;
	login: (credentials: Credentials) => Promise<void>;
	logout: () => Promise<void>;
	refreshToken: () => Promise<string | void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const queryClient = useQueryClient();

	const loginMutation = useMutation<LoginResponse, Error, Credentials>({
		mutationFn: async (credentials: Credentials) => {
			const response = await authService.login(credentials);
			return response; 
		},
		onSuccess: (data) => {
			setUser(data.user);
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
		},
	});

	const logoutMutation = useMutation<void, Error>({
		mutationFn: async () => {
			await authService.logout();
		},
		onSuccess: () => {
			setUser(null);
			queryClient.clear();
		},
	});

	const refreshToken = async (): Promise<string | void> => {
		try {
			const accessToken = await authService.refreshAccessToken();
			queryClient.invalidateQueries({ queryKey: ["currentUser"] });
			return accessToken;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			await logoutMutation.mutateAsync();
		}
	};

	const login = async (credentials: Credentials): Promise<void> => {
		await loginMutation.mutateAsync(credentials);
	};

	const logout = async (): Promise<void> => {
		await logoutMutation.mutateAsync();
	};

	useEffect(() => {
		if (TokenService.getRefreshToken()) {
			refreshToken();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout, refreshToken }}>
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
