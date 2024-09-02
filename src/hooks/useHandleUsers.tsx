import { patchUserState } from "@/services/userService";
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
