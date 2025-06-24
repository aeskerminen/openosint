import React, { useState } from "react";
import datapointService from "../../../services/datapointService";
import { useJobStatus } from "../hooks/useJobStatus";
import { useAppDispatch } from "../../../reduxHooks";
import { fetchDatapoints } from "../../../slices/datapointSlice";

interface DatapointUploadContainerProps {}

const DatapointUploadContainer: React.FC<
  DatapointUploadContainerProps
> = ({}) => {
  const [jobID, setJobID] = useState<string>("");
  const [status, setStatus] = useState<string>("idle");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", "unnamed");
    datapointService
      .uploadDatapoint(formData)
      .then((response) => {
        setSelectedFile(null);
        setStatus("processing");
        setJobID(response.data.jobID);
        fileInputRef.current!.value = "";
      })
      .catch(() => {
        alert("Failed to upload file. Please try again.");
      });
  };

  useJobStatus(jobID, () => {
    setStatus("done");
    setJobID("");
    dispatch(fetchDatapoints());
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold">Datapoint Explorer</p>
      <form className="flex flex-row items-center gap-2 bg-[#101010] p-4">
        <input
          type="file"
          accept="image/*"
          className="bg-[#1a1a1a] text-white px-4 py-2 rounded"
          ref={fileInputRef}
          onChange={(e) => {
            setSelectedFile(
              e.currentTarget.files ? e.currentTarget.files[0] : null
            );
          }}
        />
        <button
          type="submit"
          className=" text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          Upload Datapoint
        </button>
      </form>
      <div className="bg-[#1a1a1a] p-4 rounded">Status: {status}</div>
    </div>
  );
};

export default DatapointUploadContainer;
