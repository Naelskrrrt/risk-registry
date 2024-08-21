import { createContext, useContext, useState } from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { apiUser } from "@/api/apiUser";

export interface User {
    id: string;
    email: string;
    name: string;
    // Ajoutez d'autres propriétés selon les besoins
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
    isLoading: boolean;
}

export interface LoginResponse {
    user: User;
    token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // const [user, setUser] = useState<User | null>(null);
    // const queryClient = useQueryClient();

    const results = useQueries({
        queries: [
            {
                queryKey: ["users"],
                queryFn: async () => {
                    const { data } = await apiUser.get("/auth/me");
                    return data;
                },
                staleTime: Infinity,
            },
        ],
    });

    console.log(results);
};
