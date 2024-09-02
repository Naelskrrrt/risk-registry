import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
	username: z.string().min(1, { message: "Le nom d'utilisateur est requis" }),
	email: z.string().email({ message: "L'adresse e-mail n'est pas valide" }),
	role: z.enum(["ADMIN", "RRA", "RIT", "VISITEUR"], {
		errorMap: () => ({ message: "Le rôle sélectionné n'est pas valide" }),
	}),
	password: z.string().min(6, {
		message: "Le mot de passe doit contenir au moins 6 caractères",
	}),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
	onSubmit: (data: UserFormData) => void;
	defaultValues?: Partial<UserFormData>;
}

export default function UserForm({ onSubmit, defaultValues }: UserFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserFormData>({
		resolver: zodResolver(userSchema),
		defaultValues,
	});
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor="username">Nom d'utilisateur</label>
				<input id="username" {...register("username")} />
				{errors.username && <p>{errors.username.message}</p>}
			</div>
			<div>
				<label htmlFor="email">Email</label>
				<input id="email" {...register("email")} />
				{errors.email && <p>{errors.email.message}</p>}
			</div>
			<div>
				<label htmlFor="role">Rôle</label>
				<select id="role" {...register("role")}>
					<option value="ADMIN">Admin</option>
					<option value="RRA">RRA</option>
					<option value="RIT">RIT</option>
					<option value="VISITEUR">Visiteur</option>
				</select>
				{errors.role && <p>{errors.role.message}</p>}
			</div>
			<div>
				<label htmlFor="password">Mot de passe</label>
				<input
					id="password"
					type="password"
					{...register("password")}
				/>
				{errors.password && <p>{errors.password.message}</p>}
			</div>
			<button type="submit">Soumettre</button>
		</form>
	);
}
