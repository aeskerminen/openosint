import type React from "react";

interface ToolbarProps {
    views: Array<Object>,
    setCurrentView: (input : string) => void
}


const Toolbar : React.FC<ToolbarProps> = ({views, setCurrentView}) => {
    return(
        <div className="p-2 flex flex-row gap-2 bg-black justify-center">
            {views.map((view) => {
                return(
                    <button onClick={() => {setCurrentView(view.name)}} className="p-2 bg-[#181818]">{view.name}</button>
                )
            })}
        </div>
    )
};

export default Toolbar;
