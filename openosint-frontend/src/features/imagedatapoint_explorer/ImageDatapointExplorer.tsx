import DatapointListContainer from "./components/ImageDatapointListContainer";
import type { ImageDatapoint } from "../../types/imageDatapoint";

interface DatapointExplorerProps {
  selectedDatapoint: ImageDatapoint | null;
  setSelectedDatapoint: (datapoint: ImageDatapoint) => void;
}

const DatapointExplorer: React.FC<DatapointExplorerProps> = ({
  selectedDatapoint,
  setSelectedDatapoint,
}) => {
  return (
    <div className="flex flex-col gap-4 flex-1 max-w-5xl h-full justify p-4">
      <DatapointListContainer
        onSelect={setSelectedDatapoint}
        selectedDatapoint={selectedDatapoint}
      />
    </div>
  );
};

export default DatapointExplorer;
