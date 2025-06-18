import React, { useState } from "react";
import datapointService from "../datapoint_explorer/services/datapointService"
import { useJobStatus } from "./hooks/useJobStatus";

const DatapointExplorer = () => {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("name", selectedFile.name);

        console.log("File ready to be uploaded:", selectedFile);

        datapointService.uploadDatapoint(formData)
            .then(response => {
                console.log("File uploaded successfully:", response);
                setSelectedFile(null);
                setStatus("processing")
                setJobID(response.data.jobID);
                fileInputRef.current!.value = "";
            })
            .catch(error => {
                console.error("Error uploading file:", error);
                alert("Failed to upload file. Please try again.");
            });
    };

    const [jobID, setJobID] = useState<string>("");
    const [status, setStatus] = useState<string>("idle");

    useJobStatus(jobID, () => {
        setStatus("done")
        setJobID("");
    })

    return (
        <div className="flex flex-col h-screen items-center justify-center flex-1">
            <p className="text-2xl font-bold mb-4">Datapoint Explorer</p>

            {/* Form for uploading a picture (datapoint)*/}
            <div className="flex-1">
                <form className="flex flex-row items-center gap-2 bg-[#101010] p-4">
                    <input type="file" accept="image/*" className="bg-[#1a1a1a] text-white px-4 py-2 rounded" ref={fileInputRef} onChange={(e) => { setSelectedFile(e.currentTarget.files ? e.currentTarget.files[0] : null) }} />
                    <button type="submit" className=" text-white px-4 py-2 rounded" onClick={handleSubmit} >
                        Upload Datapoint
                    </button>
                </form>
            </div>

            <div>Status: {status}</div>

            {/* List of all datapoints fetched from the backend */}
            <div className="flex-1">Datapoints</div>

        </div>
    )
}

export default DatapointExplorer;