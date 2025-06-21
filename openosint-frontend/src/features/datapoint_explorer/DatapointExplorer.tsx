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
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );

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
          <div className="flex flex-col gap-2">
            {datapoints.map((datapoint: Datapoint) => {
              const date = new Date(datapoint.createdAt);
              return (
                <div
                  key={datapoint._id}
                  className={`flex items-center gap-4 p-2 bg-[#232323] rounded cursor-pointer hover:bg-[#333] transition-all`}
                  onClick={() => setSelectedDatapoint(datapoint)}
                >
                  <img
                    src={`${config.API_BASE_URL}/images/${datapoint.filename}`}
                    alt={datapoint.name}
                    className="w-12 h-12 object-cover rounded border border-[#444]"
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-white font-semibold">
                      {datapoint.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {date.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedDatapoint && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 h-full w-full"
              onClick={() => setSelectedDatapoint(null)}
            >
              <div
                className="bg-[#181818] p-6 rounded shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={`${config.API_BASE_URL}/images/${selectedDatapoint.filename}`}
                  alt={selectedDatapoint.name}
                  className="rounded mb-4"
                  style={{width:'25vw', height: 'auto'}}
                />
                <div className="text-white text-lg font-bold mb-2">
                  {selectedDatapoint.name}
                </div>
                <div className="text-gray-400 text-sm mb-2">
                  {new Date(selectedDatapoint.createdAt).toLocaleString()}
                </div>
                <button
                  className="absolute top-2 right-2 text-white text-2xl"
                  onClick={() => setSelectedDatapoint(null)}
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatapointExplorer;
