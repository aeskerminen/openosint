import DatapointUploadContainer from "./components/DatapointUploadContainer";
import DatapointListContainer from "./components/DatapointListContainer";

const DatapointExplorer = () => {
  return (
    <div className="flex flex-row w-screen h-screen items-center justify-center flex-1 gap-4 p-4">
      <DatapointUploadContainer />
      <DatapointListContainer />
    </div>
  );
};

export default DatapointExplorer;
