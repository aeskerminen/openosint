import type { Datapoint } from "../../../types/datapoint";
import { config } from "../../../config";

interface DatapointViewerContainerProps {
  datapoint: Datapoint | null;
}

const DatapointViewerContainer = ({ datapoint }: DatapointViewerContainerProps) => {
  if (!datapoint) {
    return (
      <div className="flex-1 flex-col h-full bg-[#101010] p-4 rounded flex items-center justify-center text-gray-400">
        Select a datapoint to view its image.
      </div>
    );
  }
  return (
    <div className="flex-1 flex-col h-full bg-[#101010] p-4 rounded flex items-center justify-center">
      <img
        src={`${config.API_BASE_URL}/images/${datapoint.filename}`}
        alt={datapoint.name}
        className="rounded mb-4 max-h-[60vh] max-w-[40vw]"
        style={{ objectFit: "contain" }}
      />
      <div className="text-white text-lg font-bold mb-2">{datapoint._id}</div>
      <div className="text-gray-400 text-sm mb-2">{new Date(datapoint.createdAt).toLocaleString()}</div>
    </div>
  );
};

export default DatapointViewerContainer;
