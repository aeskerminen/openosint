import React from "react";
import { useAppSelector } from "../../reduxHooks";
import type { Datapoint } from "../../types/datapoint";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { selectAllDatapoints } from "../../slices/datapointSlice";
import L from "leaflet";
import "./leaflet_custom_icons.css";

const customMarkerIcon = L.divIcon({
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [10, 0],
  shadowSize: [0, 0],
  className: "animated-icon default-custom-icon",
});

interface DatapointMapProps {
  datapointId: string | undefined;
}

const DatapointMap: React.FC<DatapointMapProps> = ({ datapointId }) => {
  const datapoint = useAppSelector((state) =>
    state.datapoints.value.find((dp: Datapoint) => dp._id === datapointId)
  );

  const datapoints = useAppSelector(selectAllDatapoints);

  return (
    <div className="flex-1 flex-col h-full bg-[#101010] p-4 rounded flex items-center justify-center text-gray-400">
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[60.16, 24.9]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {datapoints.map((dp) => {
          console.log("Datapoint:", dp);
          return (
            <Marker
              key={dp._id}
              position={[
                dp.GPSlocation?.coordinates[0] || 0,
                dp.GPSlocation?.coordinates[1] || 0,
              ]}
              icon={customMarkerIcon}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{dp.name}</strong>
                  <p>{dp.description}</p>
                  <p>
                    Time:{" "}
                    {dp.eventTime
                      ? new Date(dp.eventTime).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DatapointMap;
