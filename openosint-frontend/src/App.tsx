import { useState } from "react";
import DataPointExplorer from "./features/datapoint_explorer/DatapointExplorer";
import DatapointViewer from "./features/datapoint_viewer/DatapointViewer";
import type { Datapoint } from "./types/datapoint";
import DatapointMap from "./features/datapoint_map/DatapointMap";
import Toolbar from "./features/toolbar/Toolbar";
import type { ToolbarView } from "./types/toolbarView";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const App = () => {
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );

  const views: Array<ToolbarView> = [
    { name: "DatapointViewer" },
    { name: "DatapointMap" },
  ];
  const [currentView, setCurrentView] = useState<string>(views[0].name);

  return (
    <div className="flex flex-row h-full w-full">
      <ResizableBox
        width={300}
        height={Infinity}
        minConstraints={[200, 100]}
        maxConstraints={[500, Infinity]}
        draggableOpts={{ handle: ".react-resizable-handle" }}
      >
        <DataPointExplorer
          selectedDatapoint={selectedDatapoint}
          setSelectedDatapoint={setSelectedDatapoint}
        ></DataPointExplorer>
      </ResizableBox>
      <div className="flex-1 h-full flex flex-col max-h-full max-w-full">
        <div
          id="problem"
          className="flex-1 flex flex-col max-w-full max-h-full"
        >
          <Toolbar views={views} setCurrentView={setCurrentView}></Toolbar>
          {currentView === views[0].name && (
            <DatapointViewer datapointId={selectedDatapoint?._id} />
          )}
          {currentView === views[1].name && (
            <DatapointMap datapointId={selectedDatapoint?._id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
