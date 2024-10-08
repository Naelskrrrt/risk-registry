/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFetchHistory } from "@/hooks/RIA/useFetchRIA";
import { DataTable } from "@/presentation/components/globalTable";
import Loader from "@/presentation/components/loader/loader";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";
import { ColumnDef } from "@tanstack/react-table";
import { Risk } from "../../Admin/constant/constant";
import { historyColumns } from "../ColumnIdentification";

export type riaHistoryProps = {
    refetch?: () => void;
    isDialogOpen?: boolean;
    setIsDialogOpen?: (value: boolean) => void;
    defaultValues?: Risk;
    width?: string; // Nouvelle propriété pour largeur personnalisée
    height?: string; // Nouvelle propriété pour hauteur personnalisée
};

const RiaHistory = ({
    isDialogOpen,
    setIsDialogOpen,
    defaultValues,
    width = "80%", // Valeur par défaut pour la largeur
    height = "100vh", // Valeur par défaut pour la hauteur
}: riaHistoryProps) => {
    const { data: riaHistory, isLoading } = useFetchHistory(defaultValues?.id);

    console.log(riaHistory);
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
                                        Ref:
                                    </span>
                                    <span className="text-gray-800 font-semibold">
                                        {defaultValues?.reference}
                                    </span>
                                </div>
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
                                        data={riaHistory ? riaHistory : []}
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

export default RiaHistory;

{
    /* <DialogHeader>
                    <DialogTitle>
                        Historique de l'évaluation des risques.
                    </DialogTitle>
                    <DialogDescription>
                        Tous les historiques de l'évaluation des risques seront
                        affichés ici.
                    </DialogDescription>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Référence</span>
                        <span className="text-gray-800 font-semibold">
                            {defaultValues?.reference}
                        </span>
                    </div>
                </DialogHeader>

                <div className="w-full h-full bg-transparent rounded-md overflow-x-auto">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <DataTable
                            ListPerPage={5}
                            isLoading={isLoading}
                            data={riaHistory ? riaHistory : []}
                            columns={historyColumns as ColumnDef<Risk>[]}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog> */
}
