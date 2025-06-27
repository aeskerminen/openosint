import { useState } from "react";
import DataPointExplorer from "./features/datapoint_explorer/DatapointExplorer";
import DatapointViewer from "./features/datapoint_viewer/DatapointViewer";
import type { Datapoint } from "./types/datapoint";
import DatapointMap from "./features/datapoint_map/DatapointMap";
import Toolbar from "./features/datapoint_explorer/components/Toolbar";
import type { ToolbarView } from "./types/toolbarView";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { FaList, FaMapMarkedAlt, FaBrain, FaBars } from "react-icons/fa";
import TexTintelligence from "./features/text_intelligence/TextIntelligence";
import { FaPaperclip } from "react-icons/fa6";

const App = () => {
  const [selectedDatapoint, setSelectedDatapoint] = useState<Datapoint | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const views: Array<ToolbarView> = [
    {
      name: "datapoint_viewer",
      displayName: "Datapoint Viewer",
      icon: <FaList />,
    },
    {
      name: "datapoint_map",
      displayName: "Datapoint Map",
      icon: <FaMapMarkedAlt />,
    },
  ];
  const [currentView, setCurrentView] = useState<string>(views[0].name);

  const ImageIntelligenceComponent = () => {
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

  const components = [
    {
      name: "image_intelligence",
      displayName: "Image Intelligence",
      icon: <FaBrain />,
      component: ImageIntelligenceComponent,
    },
    {
      name: "text_intelligence",
      displayName: "Text Intelligence",
      icon: <FaPaperclip />,
      component: TexTintelligence,
    },
    // Add more components here as needed
  ];
  const [activeComponent, setActiveComponent] = useState(components[0].name);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Top bar with burger */}
      <div className="w-full h-14 flex items-center bg-[#232526] shadow z-50 px-4 flex-shrink-0">
        <button
          className="bg-[#232526] p-2 rounded-full shadow text-gray-200 hover:bg-blue-600 hover:text-white transition-all focus:outline-none"
          onClick={() => setSidebarOpen((open) => !open)}
          title={sidebarOpen ? "Hide menu" : "Show menu"}
          style={{ outline: "none" }}
        >
          <FaBars size={22} />
        </button>
        <span className="ml-4 text-lg font-bold text-gray-200 tracking-wide">
          OpenOSINT
        </span>
      </div>
      <div className="flex flex-row flex-1 h-0 w-full overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-14 left-0 h-[calc(100vh-56px)] z-40 bg-[#232526] flex flex-col items-center gap-2 py-6 px-2 min-w-[70px] shadow-lg transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ willChange: "transform" }}
        >
          {components.map((comp) => (
            <button
              key={comp.name}
              className={`w-full rounded-full transition-all duration-200 flex flex-col items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white ${
                activeComponent === comp.name ? "bg-blue-600 text-white" : ""
              }`}
              onClick={() => {
                setActiveComponent(comp.name);
                setSidebarOpen(false);
              }}
              title={comp.displayName}
            >
              <span className="flex gap-2 justify-center items-center">
                {comp.icon}
                {comp.displayName}
              </span>
            </button>
          ))}
        </div>
        {/* Main content */}
        <div
          className="flex-1 h-full ml-0 overflow-hidden"
          style={{
            marginLeft: sidebarOpen ? 70 : 0,
            transition: "margin-left 0.3s",
          }}
        >
          {components.find((c) => c.name === activeComponent)?.component()}
        </div>
      </div>
    </div>
  );
};

export default App;
