import { useState } from "react";
import DataPointExplorer from "./features/datapoint_explorer/DatapointExplorer";
import DatapointViewer from "./features/datapoint_viewer/DatapointViewer";
import type { Datapoint } from "./types/datapoint";
import DatapointMap from "./features/datapoint_map/DatapointMap";

const App = () => {
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );

  return (
    <div className="flex flex-row h-full w-full">
      <DataPointExplorer
        selectedDatapoint={selectedDatapoint}
        setSelectedDatapoint={setSelectedDatapoint}
      ></DataPointExplorer>
      <div className="flex-1 h-full">
        <DatapointViewer datapointId={selectedDatapoint?._id} />
        {false && <DatapointMap datapointId={selectedDatapoint?._id} />}
      </div>
    </div>
  );
};

export default App;
