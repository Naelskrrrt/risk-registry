/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Process, RiskAssessment, Subprocess } from "../types/Columns";
import { useFetchStackholder } from "@/hooks/Users/useFetchUsers";
import {
    AffectedArea,
    Risk,
    RiskTypes,
    Stackholder,
} from "../../Admin/constant/constant";
import MultipleSelector, {
    Option,
} from "@/presentation/components/ui/multi-select";
import {
    useFetchAffectedArea,
    useFetchCategory,
    useFetchProcess,
    useFetchRiskType,
} from "@/hooks/RIA/useFetchRIA";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/presentation/components/ui/select";
import { fetchSubprocess, updateRia } from "@/services/riaService";
import { RIADialogProps } from "../types/Columns";
import { useUpdateResource } from "@/hooks/RIA/useFetchRIA";

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
        inherent_risk_level: defaultValues?.inherent_risk_level || "",
        controls_in_place: defaultValues?.controls_in_place || "",
        nature_of_control: defaultValues?.nature_of_control || "",
        automatic_or_manual_control:
            defaultValues?.automatic_or_manual_control || "",
        quality_of_the_control: defaultValues?.quality_of_the_control || "",
        residual_risk_level: defaultValues?.residual_risk_level || "",
        risk_strategy: defaultValues?.risk_strategy || "",
        detail_of_strategy: defaultValues?.detail_of_strategy || "",
        date_of_assessment: defaultValues?.date_of_assessment || "",
        initiator: defaultValues?.initiator || "",
        stackholder: defaultValues?.stackholder || [],
        // Ajoutez les propriétés manquantes ici

        risk_type: defaultValues?.risk_type || [], // Ajoutez cette ligne
        affected_area: defaultValues?.affected_area || [], // Ajoutez cette ligne
        category: defaultValues?.category || [], // Ajoutez cette ligne
    });

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [subprocessPending, setSubprocessPending] = useState<boolean>(false);

    useEffect(() => {
        const effectFetchSubprocess = async () => {
            if (process_state) {
                setSubprocessPending(true);
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
                    setSubprocessPending(false);
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
        isError,
        isSuccess,
        error,
    } = useUpdateResource();

    const onSubmit = (data) => {
        data.preventDefault();
        console.log(formData);
        updateRIA(
            { id: defaultValues?.id, data: formData as Risk },
            {
                onSuccess: () => {
                    toast.success("Risk mit à jour avec succès", {
                        description: `Risk mit à jour`,
                    });
                    setIsDialogOpen?.(false);
                    // resetValue();
                    if (refetch) return refetch();
                },
            }
        );
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
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
                            <Input
                                label="Référence"
                                name="reference"
                                value={formData.reference}
                                onChange={handleChange}
                            />
                            <div className="flex gap-4 h-14">
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
                                            {processes?.map((proc: Process) => (
                                                <SelectItem
                                                    key={proc.id}
                                                    value={proc.id.toString()}>
                                                    {proc.id} - {proc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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
                            <Input
                                label="Process Objectives"
                                name="process_objectives"
                                value={formData.process_objectives}
                                onChange={handleChange}
                            />
                            <Input
                                label="Inherent risk Description"
                                name="inherent_risk_description"
                                value={formData.inherent_risk_description}
                                onChange={handleChange}
                            />
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
                            <Button onClick={onSubmit}>Soumettre</Button>
                            <Button onClick={() => setStep(2)}>Suivant</Button>
                        </>
                    )}

                    {/* Étape 2: Informations de contact */}
                    {step === 2 && (
                        <>
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
                            <div className="flex gap-2">
                                <Input
                                    label="Probability"
                                    type="number"
                                    name="probability"
                                    value={formData.probability as string}
                                    onChange={handleChange}
                                />
                                <Input
                                    label="Impact"
                                    type="number"
                                    name="impact"
                                    value={formData.impact as string}
                                    onChange={handleChange}
                                />
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
                                    value={formData.risk_strategy.toLowerCase()}
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
                                                    key={riskStrat.toLowerCase()}
                                                    value={riskStrat.toLowerCase()}>
                                                    {riskStrat}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Input
                                    label="Detail of Strategy"
                                    name="detail_of_strategy"
                                    value={formData.detail_of_strategy}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setStep(1)}>
                                    Précédent
                                </Button>
                                <Button onClick={() => setStep(3)}>
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
                                    value={formData.nature_of_control.toLowerCase()}
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
                                                    key={item.toLowerCase()}
                                                    value={item.toLowerCase()}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={formData.automatic_or_manual_control.toLowerCase()}
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
                                                    key={item.toLowerCase()}
                                                    value={item.toLowerCase()}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    label="Controls In Place"
                                    name="controls_in_place"
                                    value={formData.controls_in_place}
                                    onChange={handleChange}
                                />
                                <Select
                                    value={formData.quality_of_the_control.toLowerCase()}
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
                                                    key={item.toLowerCase()}
                                                    value={item.toLowerCase()}>
                                                    {item}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setStep(2)}>
                                    Précédent
                                </Button>
                                <Button onClick={onSubmit}>Soumettre</Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
