import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

type FormFields = z.infer<typeof schema>;

export const useSignInForm = () => {
	const [isVisible, setIsVisible] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(schema),
	});

	const toggleVisibility = () => setIsVisible(!isVisible);

	const onSubmit: SubmitHandler<FormFields> = async (data) => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log(data);
			throw Error();

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			setError("root", {
				message: "This email is already taken",
			});
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
