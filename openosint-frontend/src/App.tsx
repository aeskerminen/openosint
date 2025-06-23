import { useState } from "react";
import DataPointExplorer from "./features/datapoint_explorer/DatapointExplorer";
import DatapointViewer from "./features/datapoint_viewer/DatapointViewer";
import type { Datapoint } from "./types/datapoint";
import DatapointMap from "./features/datapoint_map/DatapointMap";
import Toolbar from "./features/toolbar/Toolbar";

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
      <div className="flex-1 h-full flex flex-col">
        <Toolbar></Toolbar>
        <div id="problem" className="flex-1 flex">
          <DatapointViewer datapointId={selectedDatapoint?._id} />
          {false && <DatapointMap datapointId={selectedDatapoint?._id} />}
        </div>
      </div>
    </div>
  );
};

export default App;
