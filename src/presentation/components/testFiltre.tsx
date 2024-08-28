import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useFilteredUsers } from "@/hooks/useFilteredUsers";

interface FormValues {
    search: string;
    role: string;
    stackholder: string;
}

const UserList: React.FC = () => {
    const { control, handleSubmit, watch } = useForm<FormValues>({
        defaultValues: {
            search: "",
            role: "",
            stackholder: "",
        },
    });

    // Utilisation de watch pour obtenir les valeurs des champs
    const search = watch("search");
    const role = watch("role");
    const stackholder = watch("stackholder");

    const { data, isLoading } = useFilteredUsers({
        search,
        role,
        stackholder,
    });

    const users = data?.results;

    const onSubmit = (values: FormValues) => {
        // Vous pouvez gérer les valeurs de formulaire ici si nécessaire
        console.table(values);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="search"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Search users"
                        />
                    )}
                />
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <select {...field}>
                            <option value="">Select Role</option>
                            {/* Ajouter les options des rôles ici */}
                        </select>
                    )}
                />
                <Controller
                    name="stackholder"
                    control={control}
                    render={({ field }) => (
                        <select {...field}>
                            <option value="">Select Stackholder</option>
                            {/* Ajouter les options des stackholders ici */}
                        </select>
                    )}
                />
                <button type="submit">Filter</button>
            </form>

            <ul>
                {users?.map((user: { id: number; name: string }) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
