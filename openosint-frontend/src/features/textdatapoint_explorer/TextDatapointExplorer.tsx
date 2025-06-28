import type { TextDatapoint } from "../../types/textDatapoint";
import TextDatapointListContainer from "./components/TextDatapointListContainer";

interface TextDatapointExplorerProps {
  selectedTextDatapoint: TextDatapoint | null;
  setSelectedTextDatapoint: (datapoint: TextDatapoint) => void;
}

const TextDatapointExplorer: React.FC<TextDatapointExplorerProps> = ({
  selectedTextDatapoint,
  setSelectedTextDatapoint,
}) => {
  return (
    <div className="flex flex-col gap-4 flex-1 max-w-5xl h-full justify p-4">
      <TextDatapointListContainer
        onSelect={setSelectedTextDatapoint}
        selectedDatapoint={selectedTextDatapoint}
      />
    </div>
  );
};

export default TextDatapointExplorer;
