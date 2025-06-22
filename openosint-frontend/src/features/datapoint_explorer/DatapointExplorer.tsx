import DatapointUploadContainer from "./components/DatapointUploadContainer";
import DatapointListContainer from "./components/DatapointListContainer";
import DatapointViewerContainer from "./components/DatapointViewerContainer";
import { useState } from "react";
import type { Datapoint } from "../../types/datapoint";

const DatapointExplorer = () => {
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(null);

  return (
    <div className="flex flex-row w-screen h-screen items-center justify-center flex-1">
      <div className="flex flex-col gap-4 flex-1 max-w-5xl h-screen justify p-4">
        <DatapointUploadContainer />
        <DatapointListContainer
          onSelect={setSelectedDatapoint}
          selectedDatapoint={selectedDatapoint}
        />
      </div>
      <DatapointViewerContainer datapointId={selectedDatapoint?._id} />
    </div>
  );
};

export default DatapointExplorer;
