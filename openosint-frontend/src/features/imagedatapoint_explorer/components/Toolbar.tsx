import type React from "react";
import type { ToolbarView } from "../../../types/toolbarView";

interface ToolbarProps {
  views: Array<ToolbarView>;
  setCurrentView: (input: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ views, setCurrentView }) => {
  return (
    <nav className="w-full flex justify-center items-center p-2 bg-black">
      <div className="flex flex-row gap-4">
        {views.map((view) => (
          <button
            key={view.name}
            data-testid={`toolbar-${view.name}-button`}
            onClick={() => setCurrentView(view.name)}
            className="p-3 rounded-full"
          >
            <span className="flex flex-row gap-4 items-center justify-center">
              {view.icon} {view.displayName}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Toolbar;
