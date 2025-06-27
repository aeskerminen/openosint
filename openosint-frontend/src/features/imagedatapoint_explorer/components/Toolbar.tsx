import type React from "react";
import type { ToolbarView } from "../../../types/toolbarView";

interface ToolbarProps {
  views: Array<ToolbarView>;
  setCurrentView: (input: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ views, setCurrentView }) => {
  return (
    <nav className="w-full flex justify-center items-center p-2 bg-gradient-to-r from-[#232526] to-[#414345] mb-1">
      <div className="flex flex-row gap-4">
        {views.map((view) => (
          <button
            key={view.name}
            data-testid={`toolbar-${view.name}-button`}
            onClick={() => setCurrentView(view.name)}
            className="px-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-200
                                   bg-[#23272f] text-gray-200 shadow hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
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
