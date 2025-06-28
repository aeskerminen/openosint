import type { ImageDatapoint } from "../../../types/imageDatapoint";

interface ImageDatapointDataContainerProps {
  setEditMode: (e: boolean) => void;
  datapoint: ImageDatapoint;
}

const ImageDatapointDataContainer: React.FC<
  ImageDatapointDataContainerProps
> = ({ setEditMode, datapoint }) => {
  return (
    <>
      <div className="text-white text-lg font-bold flex items-center gap-2 w-full">
        <p data-testid="datapoint-viewer-attribute-name">{datapoint.name}</p>
        <button
          className="ml-2 text-xs bg-gray-900 px-2 py-1 rounded ml-auto"
          onClick={() => setEditMode(true)}
        >
          Edit
        </button>
      </div>
      <div className="text-gray-400 text-sm mb-1">
        Event Time:
        <span data-testid="datapoint-viewer-attribute-eventtime">
          {datapoint.eventTime
            ? new Date(datapoint.eventTime).toLocaleString()
            : "N/A"}
        </span>
      </div>
      <div className="text-gray-300 text-sm mb-1">
        Description:
        <span data-testid="datapoint-viewer-attribute-description">
          {datapoint.description || "No description"}
        </span>
      </div>
      <div className="text-gray-300 text-sm mb-1">
        GPS Location:
        <span data-testid="datapoint-viewer-attribute-longitude">
          {datapoint.GPSlocation
            ? `${datapoint.GPSlocation.coordinates[0]}`
            : "N/A"}
        </span>
        <span>,</span>
        <span data-testid="datapoint-viewer-attribute-latitude">
          {datapoint.GPSlocation
            ? `${datapoint.GPSlocation.coordinates[1]}`
            : "N/A"}
        </span>
      </div>
      <hr className="w-full border-t border-[#333] my-2" />
      <div className="text-gray-500 text-xs mt-1">
        ID:
        <span data-testid="datapoint-viewer-attribute-id">{datapoint._id}</span>
      </div>
      <div className="text-gray-400 text-sm mb-1">
        Created:
        <span data-testid="datapoint-viewer-attribute-createdat">
          {new Date(datapoint.createdAt).toLocaleString()}
        </span>
      </div>
    </>
  );
};

export default ImageDatapointDataContainer;
