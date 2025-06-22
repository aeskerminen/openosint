import DatapointUploadContainer from "./components/DatapointUploadContainer";
import DatapointListContainer from "./components/DatapointListContainer";
import type { Datapoint } from "../../types/datapoint";

interface DatapointExplorerProps {
  selectedDatapoint: Datapoint | null;
  setSelectedDatapoint: (datapoint: Datapoint) => void;
}

const DatapointExplorer: React.FC<DatapointExplorerProps> = ({
  selectedDatapoint,
  setSelectedDatapoint,
}) => {
  return (
    <div className="flex flex-col gap-4 flex-1 max-w-5xl h-screen justify p-4">
      <DatapointUploadContainer />
      <DatapointListContainer
        onSelect={setSelectedDatapoint}
        selectedDatapoint={selectedDatapoint}
      />
    </div>
  );
};

export default DatapointExplorer;
