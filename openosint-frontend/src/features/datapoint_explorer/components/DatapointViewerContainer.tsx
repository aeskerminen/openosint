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
    <div className="flex-1 flex flex-col h-full bg-[#101010] p-4 rounded overflow-hidden">
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        <img
          src={`${config.API_BASE_URL}/images/${datapoint.filename}`}
          alt={datapoint.name}
          className="max-w-full object-contain"
          style={{ flex: 1 }}
        />
      </div>
      <div className="w-full bg-[#181818] p-4 rounded-b flex flex-col items-start border-t border-[#222]" style={{ minHeight: '80px' }}>
        <div className="text-white text-lg font-bold">{datapoint.name}</div>
        <div className="text-gray-400 text-sm">{new Date(datapoint.createdAt).toLocaleString()}</div>
        <div className="text-gray-500 text-xs mt-1">ID: {datapoint._id}</div>
      </div>
    </div>
  );
};

export default DatapointViewerContainer;
