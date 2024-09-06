/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserFormFields } from "@/presentation/pages/dashboard/Admin/components/userDialog";
import {
    createUser,
    patchUserState,
    updateResource,
} from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePatchUserState = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchUserState,
        onSuccess: (data) => {
            queryClient.invalidateQueries();
            console.log("User state updated", data);
        },
        onError: (error) => {
            return error;
        },
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries(); // Invalider les requêtes pour rafraîchir les données après la création
            console.log("User created successfully", data);
        },
        onError: (error) => {
            console.error("Error creating user", error);
            return error;
        },
    });
};

export const useUpdateResource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: {
            id: number | undefined;
            data: UserFormFields;
        }) => updateResource(params.id, params.data),

        onSuccess: (data) => {
            queryClient.invalidateQueries(); // Invalider les requêtes pour rafraîchir les données après la création
            console.log("User updated successfully", data);
        },
        onError: (error: any) => {
            console.error("Erreur lors de la mise à jour:", error.message);
        },
    });
};
