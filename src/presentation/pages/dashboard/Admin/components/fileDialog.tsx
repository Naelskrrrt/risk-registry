/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiClient } from "@/api/apiClient";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/presentation/components/ui/dialog"; // Composants Dialog de shadcn-ui
import { Button } from "@nextui-org/button"; // Composants Button de shadcn-ui
import { Description, DialogDescription } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";

interface FileImportProps {
    setIsImportModalOpen?: (isOpen: boolean) => void;
    handleRefresh?: () => void;
}

interface ApiResponse {
    message: string;
}

const FileImportDialog: React.FC<FileImportProps> = () => {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null); // État pour gérer le fichier déposé
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<ApiResponse, Error, File>({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("excel_file", file);
            const response = await apiClient.post<ApiResponse>(
                "/api/v1/users/import/",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data;
        },
        onSuccess: (response: ApiResponse) => {
            toast.success("Fichier importé avec succès", {
                description: response.message,
            });
            // setIsImportModalOpen(false);
            setOpen(false);
            setFile(null);
            // handleRefresh();
            queryClient.invalidateQueries();
        },
        onError: (error: Error) => {
            toast.error("Erreur lors de l'importation du fichier", {
                description: error.message,
            });

            setFile(null);
        },
    });

    // Gestion du drag-and-drop
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0]; // On ne prend que le premier fichier
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleConfirmImport = () => {
        if (file) {
            mutate(file); // Lancer l'importation si un fichier est présent
        } else {
            console.log("Erreur d'importation");
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        size="md"
                        className="bg-slate-800 text-white   rounded-lg hover:bg-nextblue-900"
                        onClick={() => setOpen(true)}>
                        Importer
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="font-bold text-lg">
                            Importer un fichier
                        </h2>
                        <DialogDescription className="text-md font-light">
                            Importez un fichier Excel contenant les données des
                            utilisateurs.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Zone de drag-and-drop */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="border-dashed border-3 border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer h-52">
                        {file ? (
                            <div className="text-center">
                                <p>
                                    <strong>Fichier :</strong> {file.name}
                                </p>
                                <p>
                                    <strong>Taille :</strong>{" "}
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500">
                                Glissez et déposez un fichier ici
                            </p>
                        )}
                    </div>

                    <DialogFooter className="flex w-full  flex-row-reverse">
                        <Button
                            color="danger"
                            variant="flat"
                            onClick={() => {
                                setFile(null);
                                setOpen(false);
                            }}>
                            Annuler
                        </Button>
                        <Button
                            onClick={handleConfirmImport}
                            color="primary"
                            disabled={!file}
                            isLoading={isPending}>
                            {isPending
                                ? "Importation en cours..."
                                : "Confirmer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FileImportDialog;
