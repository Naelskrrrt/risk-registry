/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    useFetchAffectedArea,
    useFetchCategory,
    useFetchProcess,
    useFetchRiskType,
    useUpdateResource,
} from "@/hooks/RIA/useFetchRIA";
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
import { fetchSubprocess } from "@/services/riaService";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
    AffectedArea,
    RiskTypes,
    Stackholder,
} from "../../Admin/constant/constant";
import {
    Process,
    RIADialogProps,
    RiskAssessment,
    Subprocess,
} from "../types/Columns";

const RiskAssessmentSchema = z.object({
    reference: z.string().nonempty("Le champ 'reference' est obligatoire"),
    process_objectives: z
        .string()
        .nonempty("Le champ 'process_objectives' est obligatoire"),
    inherent_risk_description: z
        .string()
        .nonempty("Le champ 'inherent_risk_description' est obligatoire"),

    nature_of_control: z
        .string()
        .nonempty("Le champ 'nature_of_control' est obligatoire"),
    automatic_or_manual_control: z
        .string()
        .nonempty("Le champ 'automatic_or_manual_control' est obligatoire"),
    quality_of_the_control: z.enum(["Strong", "Acceptable", "Weak"]),
    detail_of_strategy: z
        .string()
        .nonempty("Le champ 'detail_of_strategy' est obligatoire"),
    process: z.number().min(1, "Le process doit être un nombre valide"),
    risk_strategy: z
        .string()
        .nonempty("Le champ 'risk_strategy' est obligatoire"),
    subprocess: z.number().min(1, "Le subprocess doit être un nombre valide"),
    stackholder: z
        .array(z.number())
        .nonempty("Le champ 'stackholder' est obligatoire"),
    category: z
        .array(z.number())
        .nonempty("Le champ 'category' est obligatoire"),
    affected_area: z
        .array(z.number())
        .nonempty("Le champ 'affected_area' est obligatoire"),
    risk_type: z
        .array(z.number())
        .nonempty("Le champ 'risk_type' est obligatoire"),

    controls_in_place: z
        .string()
        .nonempty("Le champ 'controls_in_place' est obligatoire"),
});

export const RiaDialog = ({
    refetch,
    isDialogOpen,
    setIsDialogOpen,
    defaultValues,
}: RIADialogProps) => {
    const [formData, setFormData] = useState<RiskAssessment>({
        reference: defaultValues?.reference || "",
        process: defaultValues?.process?.id || 0,
        subprocess: defaultValues?.subprocess?.id || 0,
        process_objectives: defaultValues?.process_objectives || "",
        inherent_risk_description:
            defaultValues?.inherent_risk_description || "",
        probability: defaultValues?.probability || 0,
        impact: defaultValues?.impact || 0,
        controls_in_place: defaultValues?.controls_in_place || "",
        nature_of_control: defaultValues?.nature_of_control || "Preventive",
        automatic_or_manual_control:
            defaultValues?.automatic_or_manual_control || "Manual",
        quality_of_the_control: defaultValues?.quality_of_the_control || "Weak",
        risk_strategy: defaultValues?.risk_strategy || "Tolerate",
        detail_of_strategy: defaultValues?.detail_of_strategy || "",
        stackholder: [],
        risk_type: [],
        affected_area: [],
        category: [],
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateFormData = (data: any) => {
        try {
            RiskAssessmentSchema.parse(data);
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

    const [selectedRiskType, setSelectedRiskType] = useState<Option[]>([]);
    const [selectedAffectedArea, setSelectedAffectedArea] = useState<Option[]>(
        []
    );
    const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);

    const [process_state, setProcessState] = useState<number>(
        defaultValues?.process?.id || 0
    );
    const [subprocesses, setSubprocesses] = useState<Subprocess[]>([]);

    useEffect(() => {
        const effectFetchSubprocess = async () => {
            if (process_state) {
                try {
                    const fetchedSubprocess: Subprocess[] =
                        await fetchSubprocess(process_state);
                    setSubprocesses(fetchedSubprocess);
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement des sous-processus",
                        error
                    );
                } finally {
                    console.log("Subprocesses", process_state);
                }
            }
        };

        effectFetchSubprocess();
    }, [process_state]);

    const { data: stackholders } = useFetchStackholder();
    const { data: processes } = useFetchProcess();
    const { data: risk_types } = useFetchRiskType();
    const { data: affected_areas } = useFetchAffectedArea();
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
        const selectedIds = selectedRiskType.map((option) =>
            parseInt(option.value as string)
        );
        setFormData((prev) => ({ ...prev, risk_type: selectedIds }));
    }, [selectedRiskType]);

    useEffect(() => {
        const selectedIds = selectedAffectedArea.map((option) =>
            parseInt(option.value as string)
        );
        setFormData((prev) => ({ ...prev, affected_area: selectedIds }));
    }, [selectedAffectedArea]);

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
    useEffect(() => {
        setSelectedRiskType(
            defaultValues?.risk_type.map((item) => ({
                value: item.id,
                label: item.name,
            })) || []
        );
    }, [defaultValues?.risk_type]);

    // Gerer les selections par défaut Affected Area
    useEffect(() => {
        setSelectedAffectedArea(
            defaultValues?.affected_area.map((item) => ({
                value: item.id,
                label: item.name,
            })) || []
        );
    }, [defaultValues?.affected_area]);

    useEffect(() => {
        setSelectedCategories(
            defaultValues?.category.map((item) => ({
                value: item.id,
                label: item.name,
            })) || []
        );
    }, [defaultValues?.category]);

    const {
        mutate: updateRIA,

        isPending,
    } = useUpdateResource();

    const onSubmit = () => {
        validateFormData(formData);
        console.log(formData);
        updateRIA(
            { id: defaultValues?.id, data: formData as RiskAssessment },
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
                                    label="Reference"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleChange}
                                />
                                <p className="text-red-500 text-sm">
                                    {errors.reference}
                                </p>
                            </div>
                            <div className="flex gap-4 h-14">
                                <div className="w-full">
                                    <Select
                                        value={process_state?.toString()}
                                        onValueChange={(value: string) => {
                                            handleSelectChange(
                                                "process",
                                                parseInt(value)
                                            );
                                            setProcessState(parseInt(value));
                                        }}>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Sélectionner un process" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Sélectionner un process:
                                                </SelectLabel>
                                                {processes?.map(
                                                    (proc: Process) => (
                                                        <SelectItem
                                                            key={proc.id}
                                                            value={proc.id.toString()}>
                                                            {proc.id} -{" "}
                                                            {proc.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-red-500 text-sm">
                                        {errors.process}
                                    </p>
                                </div>
                                {process_state && (
                                    <Select
                                        value={formData?.subprocess?.toString()}
                                        onValueChange={(value: string) => {
                                            handleSelectChange(
                                                "subprocess",
                                                parseInt(value)
                                            );
                                        }}>
                                        <SelectTrigger className="w-full h-full relative">
                                            <SelectValue placeholder="Sélectionner un subprocess" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Sélectionner un subprocess:
                                                </SelectLabel>
                                                {subprocesses?.map(
                                                    (
                                                        subprocess: Subprocess
                                                    ) => (
                                                        <SelectItem
                                                            key={subprocess.id}
                                                            value={subprocess.id.toString()}>
                                                            {subprocess.id} -{" "}
                                                            {subprocess.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <div>
                                <Input
                                    label="Process Objectives"
                                    name="process_objectives"
                                    value={formData.process_objectives}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-red-500">
                                    {errors.process_objectives}
                                </p>
                            </div>
                            <div className="w-full">
                                <Input
                                    label="Inherent risk Description"
                                    name="inherent_risk_description"
                                    value={formData.inherent_risk_description}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-red-500">
                                    {errors.inherent_risk_description}
                                </p>
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
                                    value={selectedRiskType}
                                    onChange={setSelectedRiskType}
                                    className="w-full min-h-14 relative flex flex-col justify-center"
                                    options={risk_types?.map(
                                        (risk_type: RiskTypes) => ({
                                            value: risk_type.id,
                                            label: risk_type.name,
                                        })
                                    )}
                                    placeholder="Selectionner le(s) Types de Risk(s)"
                                    emptyIndicator={
                                        <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                                            Pas de Risk Type trouvé
                                        </p>
                                    }
                                />
                                <p className="text-sm text-red-500">
                                    {errors.risk_type}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-full">
                                    <Input
                                        label="Probability"
                                        type="number"
                                        name="probability"
                                        value={formData.probability}
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
                                        value={formData.impact}
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
                                <MultipleSelector
                                    value={selectedAffectedArea}
                                    onChange={setSelectedAffectedArea}
                                    className="w-full min-h-14 relative flex flex-col justify-center"
                                    options={affected_areas?.map(
                                        (affected_area: AffectedArea) => ({
                                            value: affected_area.id,
                                            label: affected_area.name,
                                        })
                                    )}
                                    placeholder="Affected Area(s)"
                                    emptyIndicator={
                                        <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                                            Pas de Affected Area trouvé
                                        </p>
                                    }
                                />
                                <MultipleSelector
                                    value={selectedCategories}
                                    onChange={setSelectedCategories}
                                    className="w-full min-h-14 relative flex flex-col justify-center"
                                    options={categories?.map(
                                        (category: {
                                            id: number;
                                            name: string;
                                        }) => ({
                                            value: category.id,
                                            label: category.name,
                                        })
                                    )}
                                    placeholder="Category(ies)"
                                    emptyIndicator={
                                        <p className="text-center leading-10 text-gray-600 dark:text-gray-400">
                                            Pas de Category trouvé
                                        </p>
                                    }
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={formData.risk_strategy}
                                    onValueChange={(value: string) =>
                                        handleSelectChange(
                                            "risk_strategy",
                                            value
                                        )
                                    }>
                                    <SelectTrigger className="w-full h-full relative">
                                        <SelectValue placeholder="Sélectionner un Risk Strategy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Risk Strategy
                                            </SelectLabel>
                                            {[
                                                "Tolerate",
                                                "Treat",
                                                "Transfert",
                                                "Terminate",
                                            ].map((riskStrat) => (
                                                <SelectItem
                                                    key={riskStrat}
                                                    value={riskStrat}>
                                                    {riskStrat}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-red-500">
                                    {errors.risk_strategy}
                                </p>
                                <Input
                                    label="Detail of Strategy"
                                    name="detail_of_strategy"
                                    value={formData.detail_of_strategy}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-red-500">
                                    {errors.detail_of_strategy}
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
                                    onClick={() => setStep(3)}
                                    color="primary">
                                    Suivant
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Étape 3: Informations professionnelles */}
                    {step === 3 && (
                        <>
                            <div className="flex gap-2">
                                <Select
                                    value={formData?.nature_of_control}
                                    onValueChange={(value: string) =>
                                        handleSelectChange(
                                            "nature_of_control",
                                            value
                                        )
                                    }>
                                    <SelectTrigger className="w-full h-full relative">
                                        <SelectValue placeholder="Sélectionner un Nature of Control" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Nature of Control
                                            </SelectLabel>
                                            {[
                                                "Preventive",
                                                "Detective",
                                                "Directive",
                                                "Compensating",
                                            ].map((item) => (
                                                <SelectItem
                                                    key={item}
                                                    value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-red-500">
                                    {errors.nature_of_control}
                                </p>
                                <Select
                                    value={formData.automatic_or_manual_control}
                                    onValueChange={(value: string) =>
                                        handleSelectChange(
                                            "automatic_or_manual_control",
                                            value
                                        )
                                    }>
                                    <SelectTrigger className="w-full h-full relative">
                                        <SelectValue placeholder="Sélectionner un Nature of Control" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Automatic or Manual
                                            </SelectLabel>
                                            {[
                                                "Manual",
                                                "Automatic",
                                                "Semi automatic",
                                            ].map((item) => (
                                                <SelectItem
                                                    key={item}
                                                    value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-red-500">
                                    {errors.automatic_or_manual_control}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    label="Controls In Place"
                                    name="controls_in_place"
                                    value={formData.controls_in_place}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-red-500">
                                    {errors.controls_in_place}
                                </p>
                                <Select
                                    value={formData.quality_of_the_control}
                                    onValueChange={(value: string) =>
                                        handleSelectChange(
                                            "quality_of_the_control",
                                            value
                                        )
                                    }>
                                    <SelectTrigger className="w-full h-full relative">
                                        <SelectValue placeholder="Sélectionner un Quality of the Control" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Quality of the Control
                                            </SelectLabel>
                                            {[
                                                "Strong",
                                                "Acceptable",
                                                "Weak",
                                            ].map((item) => (
                                                <SelectItem
                                                    key={item}
                                                    value={item}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-red-500">
                                    {errors.quality_of_the_control}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => setStep(2)}
                                    color="warning"
                                    variant="flat">
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
                </div>
            </DialogContent>
        </Dialog>
    );
};
