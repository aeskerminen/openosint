import { config } from "../../../config";
import React, { useEffect, useState } from "react";
import {
  fetchImageDatapoints,
  selectAllImageDatapoints,
  selectImageDatapointsStatus,
} from "../../../slices/imageDatapointSlice";
import type { ImageDatapoint } from "../../../types/imageDatapoint";
import { useAppDispatch, useAppSelector } from "../../../reduxHooks";
import { remove } from "../../../slices/imageDatapointSlice";
import { useJobStatus } from "../../../hooks/useJobStatus";
import { v4 as uuidv4 } from "uuid";
import imageDatapointService from "../../../services/imageDatapointService";
import ImageDatapointModal, {
  type ImageDatapointForm,
} from "./ImageDatapointModal";

interface ImageDatapointListProps {
  onSelect: (datapoint: ImageDatapoint) => void;
  selectedDatapoint: ImageDatapoint | null;
}

const ImageDatapointList: React.FC<ImageDatapointListProps> = ({
  onSelect,
  selectedDatapoint,
}) => {
  const dispatch = useAppDispatch();
  const datapoints = useAppSelector(selectAllImageDatapoints);
  const datapointsStatus = useAppSelector(selectImageDatapointsStatus);
  const [showModal, setShowModal] = useState(false);

  const [pendingDatapoints, setPendingDatapoints] = useState<
    {
      tempId: string;
      jobId: string;
      name: string;
      createdAt: string;
      status: "processing" | "done" | "error";
      realDatapoint?: ImageDatapoint;
      fadeOut?: boolean;
    }[]
  >([]);

  const handleModalSubmit = async (
    e: React.FormEvent,
    form: ImageDatapointForm
  ) => {
    e.preventDefault();
    if (!form.file) {
      alert("Please select a file to upload.");
      return;
    }
    const tempId = uuidv4();
    setPendingDatapoints((prev) => [
      ...prev,
      {
        tempId,
        jobId: "",
        name: form.name,
        createdAt: new Date().toISOString(),
        status: "processing",
      },
    ]);

    const hasValidCoords =
      form.longitude !== "" &&
      form.latitude !== "" &&
      !isNaN(Number(form.longitude)) &&
      !isNaN(Number(form.latitude));

    const gps = hasValidCoords
      ? {
          type: "Point" as const,
          coordinates: [
            parseFloat(form.longitude),
            parseFloat(form.latitude),
          ] as [number, number],
        }
      : undefined;

    const formData = new FormData();
    formData.append("file", form.file);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("eventTime", new Date(form.eventTime).toISOString());
    formData.append("GPSlocation", JSON.stringify(gps || null));
    imageDatapointService
      .uploadImageDatapoint(formData)
      .then((response) => {
        const jobID = response.data.jobID;
        setPendingDatapoints((prev) =>
          prev.map((dp) =>
            dp.tempId === tempId ? { ...dp, jobId: jobID } : dp
          )
        );
        setJobList((prev) => [
          ...prev,
          {
            id: jobID,
            onComplete: () => {
              dispatch(fetchImageDatapoints()).then((action: any) => {
                const newDatapoint = action.payload?.find(
                  (d: ImageDatapoint) => d.name === form.name
                );
                if (newDatapoint) {
                  setPendingDatapoints((prev) =>
                    prev.map((dp) =>
                      dp.tempId === tempId
                        ? { ...dp, status: "done", realDatapoint: newDatapoint }
                        : dp
                    )
                  );
                  setTimeout(() => {
                    setPendingDatapoints((prev) =>
                      prev.filter((dp) => dp.tempId !== tempId)
                    );
                  }, 2000);
                } else {
                  setPendingDatapoints((prev) =>
                    prev.map((dp) =>
                      dp.tempId === tempId ? { ...dp, status: "error" } : dp
                    )
                  );
                }
              });
            },
          },
        ]);
      })
      .catch(() => {
        setPendingDatapoints((prev) =>
          prev.map((dp) =>
            dp.tempId === tempId ? { ...dp, status: "error" } : dp
          )
        );
        alert("Failed to upload file. Please try again.");
      })
      .finally(() => {
        setShowModal(false);
      });
  };

  useEffect(() => {
    if (datapointsStatus === "idle") {
      dispatch(fetchImageDatapoints());
    }
  }, [dispatch, datapointsStatus]);

  const handleRemoveImageDatapoint = (datapoint: ImageDatapoint) => {
    imageDatapointService
      .removeImageDatapoint(datapoint._id)
      .then((result) => {
        dispatch(remove(datapoint));
        console.log("Image Datapoint removed:", result);
      })
      .catch((error) => {
        console.error("Failed to remove image datapoint:", error);
        alert("Failed to remove image datapoint. Please try again.");
      });
  };

  const [jobList, setJobList] = useState<
    { id: string; onComplete: () => void }[]
  >([]);

  useJobStatus(
    jobList.map((job) => ({ id: job.id, onComplete: job.onComplete }))
  );

  return (
    <div>
      <div className="flex items-center mb-4">
        <p className="text-xl font-bold">Datapoints</p>
        <button
          className="rounded-full ml-auto w-8 h-8 flex items-center justify-center"
          title="Add Datapoint"
          onClick={() => setShowModal(true)}
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
      <div className="bg-[#1a1a1a] p-4 rounded">
        <h2 className="text-white mb-2">
          This section will display all uploaded datapoints.
        </h2>
        <div
          data-testid="datapoint-list-container"
          className="flex flex-col gap-2"
        >
          {pendingDatapoints.map((dp) => (
            <div
              key={dp.tempId}
              className={`flex items-center gap-4 p-2 bg-[#232323] rounded opacity-70 ${
                dp.status === "done" ? "animate-fadeOut" : ""
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded border border-[#444]">
                {dp.status === "processing" && <span className="loader mr-2" />}
                {dp.status === "done" && (
                  <span className="text-green-400 text-xl">✔</span>
                )}
                {dp.status === "error" && (
                  <span className="text-red-400 text-xl">!</span>
                )}
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-white font-semibold">
                  {dp.realDatapoint?.name || dp.name}
                </span>
                <span className="text-xs text-gray-400">
                  {dp.realDatapoint?.createdAt || dp.createdAt}
                </span>
                <span
                  className={`text-xs mt-1 ${
                    dp.status === "processing"
                      ? "text-yellow-400"
                      : dp.status === "done"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {dp.status === "processing"
                    ? "Processing..."
                    : dp.status === "done"
                    ? "Done"
                    : "Error"}
                </span>
              </div>
            </div>
          ))}
          {datapoints.map((datapoint: ImageDatapoint) => {
            const date = new Date(datapoint.createdAt);
            return (
              <div
                data-testid="datapoint-list-entry"
                key={datapoint._id}
                className={`flex items-center gap-4 p-2 bg-[#232323] rounded cursor-pointer hover:bg-[#333] transition-all ${
                  selectedDatapoint && selectedDatapoint._id === datapoint._id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => onSelect(datapoint)}
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
                <button
                  data-testid="datapoint-list-remove-button"
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImageDatapoint(datapoint);
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {showModal && (
        <ImageDatapointModal
          handleModalSubmit={handleModalSubmit}
          setShowModal={setShowModal}
        ></ImageDatapointModal>
      )}
    </div>
  );
};

export default ImageDatapointList;
