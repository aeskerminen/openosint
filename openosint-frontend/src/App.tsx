import { useState } from "react";
import DataPointExplorer from "./features/datapoint_explorer/DatapointExplorer";
import DatapointViewer from "./features/datapoint_viewer/DatapointViewer";
import type { Datapoint } from "./types/datapoint";

const App = () => {
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );

  return (
    <div className="flex flex-row items-center justify-center h-screen w-screen gap-2">
      <DataPointExplorer
        selectedDatapoint={selectedDatapoint}
        setSelectedDatapoint={setSelectedDatapoint}
      ></DataPointExplorer>
      <div className="flex-1 h-full">
        <DatapointViewer datapointId={selectedDatapoint?._id} />
      </div>
    </div>
  );
};

export default App;
