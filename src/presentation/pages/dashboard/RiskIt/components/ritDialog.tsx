/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFetchCategory } from "@/hooks/RIA/useFetchRIA";
import { useUpdateResourceRIT } from "@/hooks/RIT/useFetchRit";
import { useFetchStackholder } from "@/hooks/Users/useFetchUsers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import MultipleSelector, {
    Option,
} from "@/presentation/components/ui/multi-select";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { RiskTypes, Stackholder } from "../../Admin/constant/constant";
import { RiskITForm, RitDialogProps } from "../types";

const RiskItAssessment = z.object({
    // category: z
    //     .array(z.number())
    //     .nonempty("Le champ 'category' est obligatoire"),
    threat: z.string().min(1, "Le champ 'threat' est obligatoire"),
    level: z.string().min(1, "Le champ 'level' est obligatoire"),
    vulnerability: z
        .string()
        .min(1, "Le champ 'vulnerability' est obligatoire"),
    asset: z.string().min(1, "Le champ 'asset' est obligatoire"),
    previous_level_of_inherent_risk: z
        .string()
        .min(1, "Le champ 'previous_level_of_inherent_risk' est obligatoire"),
    previous_level_of_residual_risk: z
        .string()
        .min(1, "Le champ 'previous_level_of_residual_risk' est obligatoire"),
    existing_controls_mitigation: z
        .string()
        .min(1, "Le champ 'existing_controls_mitigation' est obligatoire"),

    priority: z.string().min(1, "Le champ 'priority' est obligatoire"),

    treatment_strategy: z
        .string()
        .min(1, "Le champ 'treatment_strategy' est obligatoire"),
    stackholder: z
        .array(z.number())
        .nonempty("Le champ 'stackholder' est obligatoire"), // Assurez-vous que c'est un tableau
});

const LEVELS = ["Low", "High", "Medium"];

export const RitDialog = ({
    refetch,
    isDialogOpen,
    setIsDialogOpen,
    defaultValues,
}: RitDialogProps) => {
    const [formData, setFormData] = useState<RiskITForm>({
        threat: defaultValues?.threat || "",
        level: defaultValues?.level || "Moyen", // Valeur par défaut
        vulnerability: defaultValues?.vulnerability || "",
        asset: defaultValues?.asset || "",
        inherent_risk_level: defaultValues?.inherent_risk_level || "Moyen", // Valeur par défaut
        previous_level_of_inherent_risk:
            defaultValues?.previous_level_of_inherent_risk || "Moyen", // Valeur par défaut
        previous_level_of_residual_risk:
            defaultValues?.previous_level_of_residual_risk || "Moyen", // Valeur par défaut
        existing_controls_mitigation:
            defaultValues?.existing_controls_mitigation || "",

        probability: Number(defaultValues?.probability || 1), // Assurez-vous que c'est un nombre
        impact: Number(defaultValues?.impact || 1), // Assurez-vous que c'est un nombre // Valeur par défaut
        priority: defaultValues?.priority || "Moyen", // Valeur par défaut
        controls_in_place: defaultValues?.controls_in_place || "Acceptable", // Valeur par défaut
        risk_strategy: defaultValues?.risk_strategy || "",
        treatment_strategy: defaultValues?.treatment_strategy || "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateFormData = (data: any) => {
        try {
            RiskItAssessment.parse(data);
            toast.success("Les données sont valides", {
                description: `Les données sont valides`,
            });
            setErrors({});
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error(error.errors);
                toast.error("Les données ne sont pas valides", {
                    description: error.errors
                        .map((err) => err.message)
                        .join("\n"),
                });
                const newErrors: { [key: string]: string } = {};
                error.errors.forEach((err) => {
                    newErrors[err.path[0]] = err.message;
                });
                setErrors(newErrors);
            }
        }
    };
    const [step, setStep] = useState(1);
    const [selectedStackholders, setSelectedStackholders] = useState<Option[]>(
        []
    );

    const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

    const { data: stackholders } = useFetchStackholder();

    const { data: categories } = useFetchCategory();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const selectedIds = selectedStackholders.map((option) =>
            parseInt(option.value as string)
        );
        setFormData((prev) => ({ ...prev, stackholder: selectedIds }));
    }, [selectedStackholders]);

    useEffect(() => {
        const selectedIds = selectedCategories.map((option) =>
            parseInt(option.value as string)
        );
        setFormData((prev) => ({ ...prev, category: selectedIds }));
    }, [selectedCategories]);

    // Ajoutez ces useEffect pour gérer les sélections par défaut
    useEffect(() => {
        setSelectedStackholders(
            defaultValues?.stackholder.map((item) => ({
                value: item.id,
                label: item.name,
            })) || []
        );
    }, [defaultValues?.stackholder, stackholders]);
    // Gerer les selections par défaut Risk Type

    // Gerer les selections par défaut Affected Area

    useEffect(() => {
        setSelectedCategories(
            defaultValues?.category.map((item) => ({
                value: item.id,
                label: item.name,
            })) || []
        );
    }, [defaultValues?.category]);

    const {
        mutate: updateRit,

        isPending,
    } = useUpdateResourceRIT();

    const onSubmit = () => {
        validateFormData(formData);
        console.log(formData);
        console.log(defaultValues?.id);
        updateRit(
            { id: defaultValues?.id, data: formData as RiskITForm },
            {
                onSuccess: () => {
                    toast.success("Risk mit à jour avec succès", {
                        description: `Risk mit à jour`,
                    });
                    setStep(1);
                    setIsDialogOpen?.(false);
                    if (refetch) return refetch();
                },
            }
        );
    };

    console.log(formData);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Modifier l'évaluation des risques.
                    </DialogTitle>
                    <DialogDescription>
                        Entrer une modification adéquate.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    {/* Étape 1: Informations personnelles */}
                    {step === 1 && (
                        <>
                            <div>
                                <Input
                                    label="Threat"
                                    name="threat"
                                    value={formData.threat}
                                    onChange={handleChange}
                                />
                                <p className="text-red-500 text-sm">
                                    {errors.threat}
                                </p>
                            </div>
                            <div className="flex gap-4 h-14">
                                <div className="w-full">
                                    <Select
                                        value={formData.level?.toString()}
                                        onValueChange={(value: string) => {
                                            handleSelectChange("level", value);
                                        }}>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Sélectionner un Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Sélectionner un level:
                                                </SelectLabel>
                                                {LEVELS?.map(
                                                    (level: string) => (
                                                        <SelectItem
                                                            key={level.toLowerCase()}
                                                            value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-red-500 text-sm">
                                        {errors.level}
                                    </p>
                                </div>

                                <Input
                                    label="Vulnerability"
                                    name="vulnerability"
                                    value={formData.vulnerability}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Input
                                    label="Asset"
                                    name="asset"
                                    value={formData.asset}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-red-500">
                                    {errors.asset}
                                </p>
                            </div>
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <Select
                                        value={formData.inherent_risk_level?.toString()}
                                        onValueChange={(value: string) => {
                                            handleSelectChange(
                                                "inherent_risk_level",
                                                value
                                            );
                                        }}>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Sélectionner un Inherent Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Sélectionner un Inherent
                                                    Level:
                                                </SelectLabel>
                                                {LEVELS?.map(
                                                    (level: string) => (
                                                        <SelectItem
                                                            key={level.toLowerCase()}
                                                            value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-red-500">
                                        {errors.inherent_risk_level}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <Select
                                        value={formData.previous_level_of_inherent_risk?.toString()}
                                        onValueChange={(value: string) => {
                                            handleSelectChange(
                                                "previous_level_of_inherent_risk",
                                                value
                                            );
                                        }}>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Previous Inherent Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Previous Inherent Level:
                                                </SelectLabel>
                                                {LEVELS?.map(
                                                    (level: string) => (
                                                        <SelectItem
                                                            key={level.toLowerCase()}
                                                            value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-red-500">
                                        {errors.previous_level_of_inherent_risk}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <Select
                                        value={formData.previous_level_of_residual_risk?.toString()}
                                        onValueChange={(value: string) => {
                                            handleSelectChange(
                                                "previous_level_of_residual_risk",
                                                value
                                            );
                                        }}>
                                        <SelectTrigger className="w-full h-full min-h-14 relative">
                                            <SelectValue placeholder="Previous Residual Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Previous Residual Level :
                                                </SelectLabel>
                                                {LEVELS?.map(
                                                    (level: string) => (
                                                        <SelectItem
                                                            key={level.toLowerCase()}
                                                            value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-red-500">
                                        {errors.previous_level_of_residual_risk}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full">
                                <MultipleSelector
                                    value={selectedStackholders}
                                    onChange={setSelectedStackholders}
                                    className="w-full min-h-14 relative flex flex-col justify-center"
                                    options={stackholders?.map(
                                        (stackholder: Stackholder) => ({
                                            value: stackholder.id,
                                            label: stackholder.name,
                                        })
                                    )}
                                    placeholder="Selectionner le(s) stakeholder(s)"
                                    emptyIndicator={
                                        <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                                            Pas de stakeholder trouvé
                                        </p>
                                    }
                                />
                                <p className="text-sm text-red-500">
                                    {errors.stackholder}
                                </p>
                            </div>
                            <Button
                                onClick={() => setStep(2)}
                                color="primary"
                                className="w-fit">
                                Suivant
                            </Button>
                        </>
                    )}

                    {/* Étape 2: Informations de contact */}
                    {step === 2 && (
                        <>
                            <div className="w-full">
                                <MultipleSelector
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    className="w-full min-h-14 relative flex flex-col justify-center"
                                    options={categories?.map(
                                        (category: RiskTypes) => ({
                                            value: category.id,
                                            label: category.name,
                                        })
                                    )}
                                    placeholder="Selectionner le(s) Category(ies)"
                                    emptyIndicator={
                                        <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                                            Pas de Category trouvé
                                        </p>
                                    }
                                />
                                <p className="text-sm text-red-500">
                                    {errors.category}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-full">
                                    <Input
                                        label="Probability"
                                        type="number"
                                        name="probability"
                                        value={formData.probability as number}
                                        onChange={handleChange}
                                        min={0}
                                        max={3}
                                    />
                                    <p className="text-sm text-red-500">
                                        {errors.probability}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <Input
                                        label="Impact"
                                        type="number"
                                        name="impact"
                                        value={Number(formData.impact)}
                                        onChange={handleChange}
                                        min={0}
                                        max={3}
                                    />
                                    <p className="text-sm text-red-500">
                                        {errors.impact}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    label="Existing Controls/Mitigation"
                                    name="existing_controls_mitigation"
                                    value={
                                        formData.existing_controls_mitigation
                                    }
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-full">
                                    <Select
                                        value={formData.controls_in_place}
                                        onValueChange={(value: string) =>
                                            handleSelectChange(
                                                "controls_in_place",
                                                value
                                            )
                                        }>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Controls In Place" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Controls In Place :
                                                </SelectLabel>
                                                {[
                                                    "Strong",
                                                    "Acceptable",
                                                    "Weak",
                                                ].map((control) => (
                                                    <SelectItem
                                                        key={control.toLowerCase()}
                                                        value={control}>
                                                        {control}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-red-500">
                                        {errors.controls_in_place}
                                    </p>
                                </div>
                                <div className="w-full">
                                    <Select
                                        value={formData.risk_strategy}
                                        onValueChange={(value: string) =>
                                            handleSelectChange(
                                                "risk_strategy",
                                                value
                                            )
                                        }>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Risk Strategy" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Risk Strategy :
                                                </SelectLabel>
                                                {[
                                                    "Tolerate",
                                                    "Treat",
                                                    "Transfert",
                                                    "Terminate",
                                                ].map((strategy) => (
                                                    <SelectItem
                                                        key={strategy.toLowerCase()}
                                                        value={strategy}>
                                                        {strategy}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-red-500">
                                        {errors.risk_strategy}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    label="Treatment Strategy"
                                    name="treatment_strategy"
                                    value={formData.treatment_strategy}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-red-500">
                                    {errors.treatment_strategy}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setStep(1)}
                                    variant="flat"
                                    color="warning">
                                    Précédent
                                </Button>
                                <Button
                                    onClick={onSubmit}
                                    isLoading={isPending}
                                    color="primary">
                                    Soumettre
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Étape 3: Informations professionnelles */}
                </div>
            </DialogContent>
        </Dialog>
    );
};
