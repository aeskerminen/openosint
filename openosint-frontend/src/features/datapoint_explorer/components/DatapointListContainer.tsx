import { config } from "../../../config";
import React, { useEffect } from "react";
import {
  fetchDatapoints,
  selectAllDatapoints,
  selectDatapointsStatus,
} from "../../../slices/datapointSlice";
import type { Datapoint } from "../../../types/datapoint";
import { useAppDispatch, useAppSelector } from "../../../reduxHooks";
import datapointService from "../../../services/datapointService";
import { remove } from "../../../slices/datapointSlice";

interface DatapointListContainerProps {
  onSelect: (datapoint: Datapoint) => void;
  selectedDatapoint: Datapoint | null;
}

const DatapointListContainer: React.FC<DatapointListContainerProps> = ({
  onSelect,
  selectedDatapoint,
}) => {
  const dispatch = useAppDispatch();
  const datapoints = useAppSelector(selectAllDatapoints);
  const datapointsStatus = useAppSelector(selectDatapointsStatus);

  useEffect(() => {
    if (datapointsStatus === "idle") {
      dispatch(fetchDatapoints());
    }
  }, [dispatch, datapointsStatus]);

  const handleRemoveDatapoint = (datapoint: Datapoint) => {
    datapointService
      .removeDatapoint(datapoint._id)
      .then((result) => {
        dispatch(remove(datapoint))
        console.log("Datapoint removed:", result);
      })
      .catch((error) => {
        console.error("Failed to remove datapoint:", error);
        alert("Failed to remove datapoint. Please try again.");
      });
  };

  return (
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
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveDatapoint(datapoint);
                  }}
                >
                  X
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatapointListContainer;
