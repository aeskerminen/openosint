import DatapointUploadContainer from "./components/DatapointUploadContainer";
import DatapointListContainer from "./components/DatapointListContainer";
import { useState } from "react";
import type { Datapoint } from "../../types/datapoint";
import DatapointViewer from "../datapoint_viewer/DatapointViewer";

const DatapointExplorer = () => {
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );

  return (
    <div className="flex flex-row w-screen h-screen items-center justify-center flex-1">
      <div className="flex flex-col gap-4 flex-1 max-w-5xl h-screen justify p-4">
        <DatapointUploadContainer />
        <DatapointListContainer
          onSelect={setSelectedDatapoint}
          selectedDatapoint={selectedDatapoint}
        />
      </div>
      <div className="flex-1 h-full">
        <DatapointViewer datapointId={selectedDatapoint?._id} />
      </div>
    </div>
  );
};

export default DatapointExplorer;