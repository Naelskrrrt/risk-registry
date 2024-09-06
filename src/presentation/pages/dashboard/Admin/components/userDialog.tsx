/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    useFetchRoles,
    useFetchStackholder,
} from "@/hooks/Users/useFetchUsers";
import { useCreateUser, useUpdateResource } from "@/hooks/Users/useHandleUsers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Role, Stackholder } from "../constant/constant";
import { useEffect, useState } from "react";

// ID	Session	Nom	Email	Role	Stackholder	Statut

const userSchema = z.object({
    session: z
        .string()
        .min(1, { message: "Le session d'utilisateur est requis" }),
    name: z.string().min(1, { message: "Le nom d'utilisateur est requis" }),
    email: z
        .string()
        .min(1, { message: "Le email de l'utilisateur est requis" })
        .email({ message: "Le email de l'utilisateur n'est pas valide." }),
    role: z.number().min(1, { message: "Le rôle est requis" }),
    stackholder: z.number().min(1, { message: "Le stackholder est requis" }),
});

export type UserFormFields = z.infer<typeof userSchema>;

type DefaultUser = {
    id: number | undefined;
    session: string | undefined;
    name: string | undefined;
    email: string | undefined;
    role: Role | undefined;
    stackholder: Stackholder | undefined;
};

type UserDialogProps = {
    refetch?: () => void;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (value: boolean) => void;
    defaultValues?: DefaultUser;
};

export const UserDialog = ({
    refetch,
    isDialogOpen,
    setIsDialogOpen,
    defaultValues,
}: UserDialogProps) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
        watch,
    } = useForm<UserFormFields>({
        defaultValues: {
            session: defaultValues?.session || "",
            name: defaultValues?.name || "",
            email: defaultValues?.email || "",
            role: defaultValues?.role?.id || 0,
            stackholder: defaultValues?.stackholder?.id || 0,
        },
        resolver: zodResolver(userSchema),
    });
    console.log(defaultValues);

    const { data: roles, isPending: rolePending } = useFetchRoles();
    const { data: stackholders, isPending: stackPending } =
        useFetchStackholder();
    const watchedFields = watch([
        "session",
        "name",
        "email",
        "role",
        "stackholder",
    ]);

    // State pour gérer l'état du bouton
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const areFieldsFilled = watchedFields.every(
            (field) => field !== "" && field !== 0
        );
        setIsButtonDisabled(!areFieldsFilled);
    }, [watchedFields]);

    const { mutate: createUser, isPending } = useCreateUser();
    const {
        mutate: updateUser,
        isError,
        isSuccess,
        error,
    } = useUpdateResource();

    const resetValue = () => {
        reset({
            name: "",
            session: "",
            email: "",
            role: 0,
            stackholder: 0,
        });
    };

    console.log(refetch);

    const onUpdate = (data: UserFormFields) => {
        updateUser(
            { id: defaultValues?.id, data },
            {
                onSuccess: () => {
                    toast.success("Utilisateur créé avec succès", {
                        description: `L'utilisateur ${data.name} a été ajouté avec succès`,
                    });
                    setIsDialogOpen?.(false);
                    resetValue();
                    if (refetch) return refetch();
                },
                // onError: (error: any) => {
                //     console.log("Error", error);
                //     const errorMessage =
                //         error.response?.data &&
                //         typeof error.response.data === "object"
                //             ? JSON.stringify(error.response.data, null, 2)
                //             : error.response?.data || "Erreur inconnue";
                //     toast.error("Erreur lors de la création de l'utilisateur", {
                //         description: errorMessage,
                //     });
                // },
            }
        );
    };

    const onSubmit = (data: UserFormFields) => {
        createUser(data, {
            onSuccess: () => {
                toast.success("Utilisateur créé avec succès", {
                    description: `L'utilisateur ${data.name} a été ajouté avec succès`,
                });
                setIsDialogOpen?.(false);
                resetValue();
                if (refetch) return refetch();
            },
            onError: (error: any) => {
                const errorMessage =
                    error.response?.data &&
                    typeof error.response.data === "object"
                        ? JSON.stringify(error.response.data, null, 2)
                        : error.response?.data || "Erreur inconnue";
                toast.error("Erreur lors de la création de l'utilisateur", {
                    description: errorMessage,
                });
            },
        });
    };

    useEffect(() => {
        // Réinitialiser les valeurs par défaut lorsque defaultValues change
        if (defaultValues) {
            reset({
                session: defaultValues.session || "",
                name: defaultValues.name || "",
                email: defaultValues.email || "",
                role: defaultValues.role?.id || 0,
                stackholder: defaultValues.stackholder?.id || 0,
            });
        }
    }, [defaultValues, reset]); // {{ edit_1 }}

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {defaultValues
                                ? "Modifier l'Utilisateur"
                                : "Ajout d'Utilisateur"}
                        </DialogTitle>
                        <DialogDescription>
                            {defaultValues
                                ? "Entrer une modification adéquate"
                                : "Veuillez renseigner les informations de l'utilisateur"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <div className="w-full">
                            <Input {...register("name")} label="Nom" />
                            {errors.name && (
                                <div className="text-red-500">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>
                        <div className="w-full">
                            <Input {...register("session")} label="Session" />
                            {errors.session && (
                                <div className="text-red-500">
                                    {errors.session.message}
                                </div>
                            )}
                        </div>
                        <div className="w-full">
                            <Input {...register("email")} label="Email" />
                            {errors.email && (
                                <div className="text-red-500">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex gap-4">
                            <div className="w-full flex flex-col">
                                <Select
                                    defaultValue={defaultValues?.role?.id}
                                    required
                                    onValueChange={(value) =>
                                        setValue("role", Number(value))
                                    }>
                                    <SelectTrigger className="w-full h-14 bg-zinc-100 text-zinc-500 border-transparent">
                                        <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rolePending ? (
                                            <Spinner />
                                        ) : (
                                            <SelectGroup>
                                                {roles?.map((role: Role) => (
                                                    <SelectItem
                                                        key={role.id}
                                                        value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <div className="text-red-500">
                                        {errors.role.message}
                                    </div>
                                )}
                            </div>
                            <div className="w-full flex flex-col">
                                <Select
                                    required
                                    onValueChange={(value) =>
                                        setValue("stackholder", Number(value))
                                    }
                                    defaultValue={
                                        defaultValues?.stackholder?.id
                                    }>
                                    <SelectTrigger className="w-full h-14 bg-zinc-100 text-zinc-500 border-transparent">
                                        <SelectValue placeholder="Stakeholder" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stackPending ? (
                                            <Spinner />
                                        ) : (
                                            <SelectGroup>
                                                {stackholders?.map(
                                                    (stack: Stackholder) => (
                                                        <SelectItem
                                                            key={stack.id}
                                                            value={stack.id}>
                                                            {stack.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.stackholder && (
                                    <div className="text-red-500">
                                        {errors.stackholder.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full items-start gap-3">
                        <Button
                            variant="flat"
                            color="danger"
                            onClick={() => {
                                setIsDialogOpen?.(false);
                                resetValue();
                            }}>
                            Annuler
                        </Button>
                        {defaultValues ? (
                            <Button
                                // isDisabled={isButtonDisabled}
                                color="primary"
                                isLoading={isPending}
                                onClick={handleSubmit(onUpdate)}>
                                Modifier
                            </Button>
                        ) : (
                            <Button
                                isDisabled={isButtonDisabled}
                                color="primary"
                                isLoading={isPending}
                                onClick={handleSubmit(onSubmit)}>
                                Enregistrer
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
