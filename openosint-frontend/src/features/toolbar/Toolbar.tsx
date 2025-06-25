import type React from "react";
import type { ToolbarView } from "../../types/toolbarView";

interface ToolbarProps {
    views: Array<ToolbarView>,
    setCurrentView: (input : string) => void
}

const Toolbar : React.FC<ToolbarProps> = ({views, setCurrentView}) => {
    return(
        <div className="p-2 flex flex-row gap-2 bg-black justify-center">
            {views.map((view) => {
                return(
                    <button key={view.name} data-testid={`toolbar-${view.name}-button`} onClick={() => {setCurrentView(view.name)}} className="p-2 bg-[#181818]">{view.name}</button>
                )
            })}
        </div>
    )
};

export default Toolbar;
