/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFetchRitHistory } from "@/hooks/RIT/useFetchRit";
import { DataTable } from "@/presentation/components/globalTable";
import Loader from "@/presentation/components/loader/loader";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { ColumnDef } from "@tanstack/react-table";
import { Risk } from "../../Admin/constant/constant";
import { historyColumns } from "../ColumnIdentification";
import { RiskIT } from "../types";
import { Button } from "@nextui-org/button";

export type riaHistoryProps = {
    refetch?: () => void;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (value: boolean) => void;
    defaultValues?: RiskIT;
    width?: string; // Nouvelle propriété pour largeur personnalisée
    height?: string; // Nouvelle propriété pour hauteur personnalisée
};

const RitHistory = ({
    isDialogOpen,
    setIsDialogOpen,
    defaultValues,
    width = "80%", // Valeur par défaut pour la largeur
    height = "100vh", // Valeur par défaut pour la hauteur
}: riaHistoryProps) => {
    const { data: ritHistory, isLoading } = useFetchRitHistory(
        defaultValues?.id as number
    );

    return (
        <Modal
            size="full"
            classNames={{ base: "h-96" }}
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}>
            <ModalContent
                className="overflow-x-auto p-4 w-full "
                style={{ width, height }} // Appliquer les styles personnalisés
            >
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Historique de l'évaluation du risque d'ID:{" "}
                            {defaultValues?.id}.
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col">
                                <div className="flex gap-1 items-center">
                                    <span className="text-gray-500 text-sm">
                                        Initiator:
                                    </span>
                                    <span className="text-gray-800 font-semibold">
                                        {defaultValues?.initiator}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full h-full bg-transparent rounded-md overflow-x-auto">
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <DataTable
                                        ListPerPage={5}
                                        isLoading={isLoading}
                                        data={ritHistory ? ritHistory : []}
                                        columns={
                                            historyColumns as ColumnDef<Risk>[]
                                        }
                                    />
                                )}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default RitHistory;
