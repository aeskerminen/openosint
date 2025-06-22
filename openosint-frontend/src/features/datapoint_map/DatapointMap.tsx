import React from "react";
import { useAppSelector } from "../../reduxHooks";
import type { Datapoint } from "../../types/datapoint";

interface DatapointMapProps {
  datapointId: string | undefined;
}

const DatapointMap: React.FC<DatapointMapProps> = ({ datapointId }) => {
  const datapoint = useAppSelector((state) =>
    state.datapoints.value.find((dp: Datapoint) => dp._id === datapointId)
  );

  return (
    <div className="flex-1 flex-col h-full bg-[#101010] p-4 rounded flex items-center justify-center text-gray-400">
      <p>DATAPOINT MAP</p>
    </div>
  );
};

export default DatapointMap;
