import React, { useEffect, useState } from "react";
import {
  fetchTextDatapoints,
  selectAllTextDatapoints,
  selectTextDatapointsStatus,
  remove,
} from "../../../slices/textDatapointSlice";
import type { TextDatapoint } from "../../../types/textDatapoint";
import { useAppDispatch, useAppSelector } from "../../../reduxHooks";
import { useJobStatus } from "../../../hooks/useJobStatus";
import { v4 as uuidv4 } from "uuid";
import textDatapointService from "../../../services/textDatapointService";

interface TextDatapointListContainerProps {
  onSelect: (datapoint: TextDatapoint) => void;
  selectedDatapoint: TextDatapoint | null;
}

const TextDatapointListContainer: React.FC<TextDatapointListContainerProps> = ({
  onSelect,
  selectedDatapoint,
}) => {
  const dispatch = useAppDispatch();
  const datapoints = useAppSelector(selectAllTextDatapoints);
  const datapointsStatus = useAppSelector(selectTextDatapointsStatus);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    raw_text: "",
    source: {
      platform: "",
      url: "",
      username: "",
    },
    language: "",
    translation: "",
    eventTime: "",
    longitude: "",
    latitude: "",
    tags: "",
    entities: {
      persons: [],
      organizations: [],
      locations: [],
    },
    sentiment: "",
    notes: "",
    linked_imagedatapoint_ids: [],
    createdAt: "",
  });
  const [pendingDatapoints, setPendingDatapoints] = useState<
    {
      tempId: string;
      jobId: string;
      title: string;
      createdAt: string;
      status: "processing" | "done" | "error";
      realDatapoint?: TextDatapoint;
      fadeOut?: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (datapointsStatus === "idle") {
      dispatch(fetchTextDatapoints());
    }
  }, [dispatch, datapointsStatus]);

  const handleRemoveImageDatapoint = (datapoint: TextDatapoint) => {
    textDatapointService
      .removeTextDatapoint(datapoint._id)
      .then((result) => {
        dispatch(remove(datapoint));
        console.log("Text Datapoint removed:", result);
      })
      .catch((error) => {
        console.error("Failed to remove text datapoint:", error);
        alert("Failed to remove text datapoint. Please try again.");
      });
  };

  const [jobList, setJobList] = useState<
    { id: string; onComplete: () => void }[]
  >([]);

  const handleModalInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const prepareDatapointPayload = (form): Partial<TextDatapoint> => {
    const {
      title,
      raw_text,
      source,
      language,
      translation,
      eventTime,
      longitude,
      latitude,
      tags,
      entities,
      sentiment,
      notes,
      linked_imagedatapoint_ids,
      createdAt,
    } = form;

    const payload: Partial<TextDatapoint> = {
      title,
      raw_text,
      source,
      language,
      translation,
      eventTime: eventTime || undefined,
      location:
        latitude && longitude
          ? {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              source: "user",
            }
          : undefined,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : undefined,
      entities,
      sentiment,
      notes,
      linked_image_ids: linked_imagedatapoint_ids,
      createdAt,
    };

    return payload;
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tempId = uuidv4();
    setPendingDatapoints((prev) => [
      ...prev,
      {
        tempId,
        jobId: "",
        title: form.title,
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

    textDatapointService
      .uploadTextDatapoint(prepareDatapointPayload(form))
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
              dispatch(fetchTextDatapoints()).then((action: any) => {
                const newDatapoint = action.payload?.find(
                  (d: TextDatapoint) => d.title === form.title
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

  useJobStatus(
    jobList.map((job) => ({ id: job.id, onComplete: job.onComplete }))
  );

  return (
    <div className="flex-1">
      <div className="flex items-center mb-4">
        <p className="text-xl font-bold mr-2">Datapoints</p>
        <button
          className="ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all"
          title="Add Datapoint"
          onClick={() => setShowModal(true)}
        >
          <span className="text-2xl leading-none">+</span>
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
                  {dp.realDatapoint?.title || dp.title}
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
          {datapoints.map((datapoint: TextDatapoint) => {
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
                <div className="flex flex-col flex-1">
                  <span className="text-white font-semibold">
                    {datapoint.title}
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form
            className="bg-[#232323] p-8 rounded-lg shadow-2xl flex flex-col gap-4 min-w-[350px] max-w-[90vw]"
            onSubmit={handleModalSubmit}
            style={{ minWidth: 350 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              Add New Text Datapoint
            </h2>
            <input
              className="p-2 rounded bg-[#181818] text-white border border-[#444]"
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleModalInput}
              required
            />
            <textarea
              className="p-2 rounded bg-[#181818] text-white border border-[#444]"
              name="raw_text"
              placeholder="Raw text"
              value={form.raw_text}
              onChange={handleModalInput}
              rows={2}
            />
            <input
              className="p-2 rounded bg-[#181818] text-white border border-[#444]"
              name="eventTime"
              type="datetime-local"
              value={form.eventTime}
              onChange={handleModalInput}
            />
            <div className="flex gap-2">
              <input
                className="p-2 rounded bg-[#181818] text-white border border-[#444] flex-1"
                name="longitude"
                placeholder="Longitude"
                value={form.longitude}
                onChange={handleModalInput}
                type="number"
                step="any"
              />
              <input
                className="p-2 rounded bg-[#181818] text-white border border-[#444] flex-1"
                name="latitude"
                placeholder="Latitude"
                value={form.latitude}
                onChange={handleModalInput}
                type="number"
                step="any"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition-all"
              >
                Upload
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded transition-all"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TextDatapointListContainer;
