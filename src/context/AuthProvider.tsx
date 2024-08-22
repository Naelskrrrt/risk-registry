// contexts/AuthProvider.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
import authService from "../services/authService";
import TokenService from "../services/tokenService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

export type Role = "admin" | "editor" | "user" | "guest";

interface User {
    user_id: number;
    email: string;
    session: string;
    name: string;
    stackholder_title: string;
    role: string;
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
    isAuthenticated: () => boolean;
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

    const loginMutation = useMutation<LoginResponse, Error, Credentials>({
        mutationFn: async (
            credentials: Credentials
        ): Promise<LoginResponse> => {
            const response = await authService.login(credentials);
            console.log(response);

            const { access, refresh } = response;

            const decodeAccessToken = jwtDecode(access) as User;

            const loginResponse: LoginResponse = {
                accessToken: access,
                refreshToken: refresh,
                user: decodeAccessToken,
            };

            return loginResponse;
        },
        onSuccess: (data) => {
            TokenService.setAccessToken(data.accessToken);
            TokenService.setRefreshToken(data.refreshToken);
            setUser(data.user);

            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        },
        onError: (error) => {
            console.log("Login Failed", error);
        },
    });

    const logoutMutation = useMutation<void, Error>({
        mutationFn: async () => {
            await authService.logout();
            TokenService.removeTokens();
            setUser(null);

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            await logoutMutation.mutateAsync();
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

    const isAuthenticated = () => {
        return !!user;
    };

    const hasRole = (role: Role) => {
        return user?.role === role;
    };

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
