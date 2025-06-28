import type { ImageDatapoint } from "../../../types/imageDatapoint";

const ImageExifContainer: React.FC<{ datapoint: ImageDatapoint }> = ({
  datapoint,
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 border-l border-[#222] pl-4">
      <div className="text-white text-lg font-bold mb-2">EXIF Data</div>
      <div className="text-xs text-gray-300 whitespace-pre-wrap break-all overflow-y-auto max-h-48">
        {datapoint.exifData
          ? (() => {
              try {
                const parsed = JSON.parse(datapoint.exifData);
                return (
                  <pre className="whitespace-pre-wrap break-all">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                );
              } catch {
                return datapoint.exifData;
              }
            })()
          : "No EXIF data available."}
      </div>
    </div>
  );
};

export default ImageExifContainer;
