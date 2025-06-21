import React, { useEffect, useState } from "react";
import datapointService from "../datapoint_explorer/services/datapointService";
import { useJobStatus } from "./hooks/useJobStatus";
import { useDispatch, useSelector } from "react-redux";
import {
  add,
  fetchDatapoints,
  remove,
  selectAllDatapoints,
  selectDatapointsStatus,
} from "../../slices/datapointSlice";
import type { Datapoint } from "../../types/datapoint";
import type { AppDispatch } from "../../store";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { config } from "../../config";

const DatapointExplorer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const datapoints = useAppSelector(selectAllDatapoints);
  const datapointsStatus = useAppSelector(selectDatapointsStatus);

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

    datapointService
      .uploadDatapoint(formData)
      .then((response) => {
        console.log("File uploaded successfully:", response);
        setSelectedFile(null);
        setStatus("processing");
        setJobID(response.data.jobID);
        fileInputRef.current!.value = "";
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      });
  };

  const [jobID, setJobID] = useState<string>("");
  const [status, setStatus] = useState<string>("idle");

  useJobStatus(jobID, () => {
    setStatus("done");
    setJobID("");
  });

  useEffect(() => {
    if (datapointsStatus === "idle") {
      dispatch(fetchDatapoints());
    }
  }, [dispatch, datapointsStatus]);

  return (
    <div className="flex flex-row w-screen h-screen items-center justify-center flex-1 gap-4 p-4">
      {/* Form for uploading a picture (datapoint)*/}
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-2xl font-bold mb-4">Datapoint Explorer</p>

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

      <div className="flex-1">
        <p className="text-xl font-bold mb-4">Datapoints</p>
        <div className="bg-[#1a1a1a] p-4 rounded">
          <h2 className="text-white mb-2">
            This section will display all uploaded datapoints.
          </h2>
          {datapoints.map((datapoint: Datapoint) => {
            return (
              <div
                key={datapoint._id}
                className="mb-4 p-2   bg-[#2a2a2a] rounded"
              >
                <h1>this is a datapoint: {datapoint.filename}</h1>
                <img
                  src={`${config.API_BASE_URL}/images/${datapoint.filename}`}
                ></img>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatapointExplorer;
