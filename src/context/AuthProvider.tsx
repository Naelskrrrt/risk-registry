/* eslint-disable react-hooks/rules-of-hooks */
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
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import TokenService from "../services/tokenService";

interface User {
    user_id: number;
    email: string;
    session: string;
    user_name: string;
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
    access: string;
    refresh: string;
    user: User;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (credentials: Credentials) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | undefined>;
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

            // Correction des noms des tokens
            const { access: accessToken, refresh: refreshToken } = response;

            const decodeAccessToken = jwtDecode(accessToken) as User;

            const loginResponse: LoginResponse = {
                access: accessToken,
                refresh: refreshToken,
                user: decodeAccessToken,
            };
            return loginResponse;
        },
        onSuccess: (data) => {
            TokenService.setAccessToken(data.access);
            TokenService.setRefreshToken(data.refresh);
            console.log(data);
            setUser(data.user);
            setIsAuthenticated(true);
            console.log("Login Success", data.user);
        },
        onError: (error) => {
            console.log("Login Failed", error);
            return error.message;
        },
    });

    const logoutMutation = useMutation<void, Error>({
        mutationFn: async () => {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            TokenService.removeTokens();
            queryClient.clear();
        },

        onError: (error) => {
            console.error("Logout Failed", error);
        },
    });

    const refreshToken = async (): Promise<string | undefined> => {
        try {
            const response = await authService.refreshAccessToken();
            if (response) {
                const { access: accessToken } = response;
                TokenService.setAccessToken(accessToken);
                console.log("RefreshToken: ", accessToken);
                const decodeAccessToken = jwtDecode(accessToken) as User;
                setUser(decodeAccessToken);
                return accessToken;
            }
        } catch (error) {
            const navigate = useNavigate();
            navigate("/login");
            console.error("RefreshToken Failed", error);
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
    }, []);

    useLayoutEffect(() => {
        const accessToken = TokenService.getAccessToken();
        console.log(accessToken);

        if (accessToken) {
            setUser(jwtDecode(accessToken) as User);
            setIsAuthenticated(true); // Assurez-vous que l'utilisateur est authentifié
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
