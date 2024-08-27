import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

const schema = z.object({
	session: z.string(),
	password: z.string().min(4),
});

type FormFields = z.infer<typeof schema>;

export const useSignInForm = () => {
	const [isVisible, setIsVisible] = useState(false);
	const { login, user } = useAuth();
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
	const from = location.state?.from?.pathname || "/";

	const toggleVisibility = () => setIsVisible(!isVisible);

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		try {
			const response: unknown = await login(data);

			if (response) {
				toast.success("Connecter avec succès", {
					description: `Bienvenue, ${user?.email}`,
				});
				navigate(from, { replace: true });
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Erreur lors de la connexion", {
					description: "Veuillez vérifier vos identifiants",
				});
			}
		}
	};

	console.log(user);
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
