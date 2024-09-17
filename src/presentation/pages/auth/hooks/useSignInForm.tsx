import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const schema = z.object({
    session: z.string().nonempty("Le champ session est obligatoire."),
    password: z
        .string()
        .min(4, "Le mot de passe doit contenir au moins 4 caractères."),
});

type FormFields = z.infer<typeof schema>;

export const useSignInForm = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { login } = useAuth();
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
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard/";

    const toggleVisibility = () => setIsVisible(!isVisible);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        try {
            const response = await login(data);

            if (response.user) {
                toast.success("Connecté avec succès", {
                    description: `Bienvenue, ${response.user.email}`,
                });

                // Redirection basée sur le rôle de l'utilisateur
                switch (response.user.role_id) {
                    case 1:
                        navigate("/dashboard/admin", { replace: true });
                        break;
                    case 2:
                        navigate("/dashboard/risk-it/identification", {
                            replace: true,
                        });
                        break;
                    case 3:
                        navigate("/dashboard/risk-assessment/identification", {
                            replace: true,
                        });
                        break;
                    case 4:
                        navigate("/dashboard/guest", { replace: true });
                        break;
                    default:
                        navigate(from, { replace: true }); // Par défaut, rediriger vers le `from`
                        break;
                }
            }
        } catch (error: unknown) {
            if (error) {
                toast.error("Erreur lors de la connexion", {
                    description:
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (error as any)?.response?.data?.message ||
                        "Une erreur est survenue",
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
