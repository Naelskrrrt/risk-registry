import React, { useState, useCallback, useRef } from "react";
import { Button } from "@nextui-org/button"; // NextUI import
import { XCircleIcon, CloudUploadIcon } from "lucide-react"; // Shadcn UI icons
import { bytesToMB } from "presentation/utils/bytesToMB";
import { toast } from "sonner";

const FileDropZone = ({ onFileUpload }) => {
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileRef = useRef(null);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            setDragOver(false);

            const droppedFiles = event.dataTransfer.files;
            if (droppedFiles.length > 0) {
                if (!/\.(xlsx)$/i.test(droppedFiles[0].name)) {
                    setFile(null);
                    return;
                }
                setFile(droppedFiles[0]);
                onFileUpload(droppedFiles[0]);
            }
        },
        [onFileUpload, addToast]
    );

    const handleFileUpload = () => {
        fileRef.current.click();
        fileRef.current.onchange = (event) => {
            setFile(event.target.files[0]);
            onFileUpload(event.target.files[0]);
        };
    };

    const handleFileDelete = () => {
        setFile(null);
        onFileUpload(null);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`import-file ${dragOver ? "drag-over" : ""}`}>
            {file ? (
                <div className="file-droped">
                    <XCircleIcon className="icon" />

                    <div className="file-info">
                        <h3 className="file-name">File: {file.name}</h3>
                        <p>Size: {bytesToMB(file.size)} MB</p>
                    </div>
                    <Button
                        color="error"
                        auto
                        icon={<XCircleIcon />}
                        onClick={handleFileDelete}>
                        Supprimer
                    </Button>
                </div>
            ) : (
                <div className="file-drop">
                    <h2 className="file-name">Drag and drop le fichier ici.</h2>
                    <p>Ou:</p>
                    <Button
                        auto
                        icon={<CloudUploadIcon />}
                        onClick={handleFileUpload}>
                        Upload
                    </Button>
                    <input
                        type="file"
                        ref={fileRef}
                        accept=".xlsx"
                        style={{ display: "none" }}
                    />
                </div>
            )}
        </div>
    );
};

export default FileDropZone;
