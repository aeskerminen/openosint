import React from "react";
import type { TextDatapoint } from "../../types/textDatapoint";

interface TextDatapointViewerProps {
  textDatapoint: TextDatapoint | null;
}

const TextDatapointViewer: React.FC<TextDatapointViewerProps> = ({ textDatapoint }) => {
  if (!textDatapoint) {
    return <div className="p-4 text-gray-400">No text datapoint selected.</div>;
  }
  return (
    <div className="p-4 bg-gray-900 rounded shadow text-gray-200 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">{textDatapoint.title}</h2>
      <div className="mb-2">
        <span className="font-semibold">Text:</span>
        <pre className="bg-gray-800 p-2 rounded mt-1 whitespace-pre-wrap">{textDatapoint.raw_text}</pre>
      </div>
      {textDatapoint.language && (
        <div className="mb-2">
          <span className="font-semibold">Language:</span> {textDatapoint.language}
        </div>
      )}
      {textDatapoint.translation && (
        <div className="mb-2">
          <span className="font-semibold">Translation:</span> {textDatapoint.translation}
        </div>
      )}
      {textDatapoint.tags && textDatapoint.tags.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Tags:</span> {textDatapoint.tags.join(", ")}
        </div>
      )}
      {/* Add more fields as needed */}
    </div>
  );
};

export default TextDatapointViewer;