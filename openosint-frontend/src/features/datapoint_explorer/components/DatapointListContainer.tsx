import { config } from "../../../config";
import React, { useEffect, useState } from "react";
import {
  fetchDatapoints,
  selectAllDatapoints,
  selectDatapointsStatus,
} from "../../../slices/datapointSlice";
import type { Datapoint } from "../../../types/datapoint";
import { useAppDispatch, useAppSelector } from "../../../reduxHooks";

interface DatapointListContainerProps {}

const DatapointListContainer: React.FC<DatapointListContainerProps> = ({}) => {
  const dispatch = useAppDispatch();
  const datapoints = useAppSelector(selectAllDatapoints);
  const datapointsStatus = useAppSelector(selectDatapointsStatus);

  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );

  useEffect(() => {
    if (datapointsStatus === "idle") {
      dispatch(fetchDatapoints());
    }
  }, [dispatch, datapointsStatus]);

  const onCloseModal = () => {
    setSelectedDatapoint(null);
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
                    {datapoint._id}
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
            onClick={onCloseModal}
          >
            <div
              className="bg-[#181818] p-6 rounded shadow-lg relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${config.API_BASE_URL}/images/${selectedDatapoint.filename}`}
                alt={selectedDatapoint.name}
                className="rounded mb-4"
                style={{ width: "25vw", height: "auto" }}
              />
              <div className="text-white text-lg font-bold mb-2">
                {selectedDatapoint._id}
              </div>
              <div className="text-gray-400 text-sm mb-2">
                {new Date(selectedDatapoint.createdAt).toLocaleString()}
              </div>
              <button
                className="absolute top-2 right-2 text-white text-2xl"
                onClick={onCloseModal}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatapointListContainer;
