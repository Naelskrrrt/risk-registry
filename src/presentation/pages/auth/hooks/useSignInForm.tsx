import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";

const schema = z.object({
    session: z.string(),
    password: z.string().min(4),
});

type FormFields = z.infer<typeof schema>;

export const useSignInForm = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { login, user, isAuthenticated } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({
        defaultValues: {
            session: "",
            password: "",
        },
        resolver: zodResolver(schema),
    });

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response: unknown = await login(data);
            console.log(isAuthenticated);
            if (response) {
                toast.success("Connecter avec succès", {
                    description: `Bienvenue, ${user?.email}`,
                });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Erreur lors de la connexion", {
                    description: "Veuillez vérifier vos identifiants",
                });
            }
        }
    };

    return {
        register,
        handleSubmit,
        toggleVisibility,
        onSubmit,
        isVisible,
        isSubmitting,
        errors,
    };
};
