import React from "react";
import { useAppSelector } from "../../reduxHooks";
import type { Datapoint } from "../../types/datapoint";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

interface DatapointMapProps {
  datapointId: string | undefined;
}

const DatapointMap: React.FC<DatapointMapProps> = ({ datapointId }) => {
  const datapoint = useAppSelector((state) =>
    state.datapoints.value.find((dp: Datapoint) => dp._id === datapointId)
  );

  return (
    <div className="flex-1 flex-col h-full bg-[#101010] p-4 rounded flex items-center justify-center text-gray-400">
      <MapContainer style={{height: '100%', width: '100%'}} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DatapointMap;
