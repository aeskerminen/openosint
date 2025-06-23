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
  popupAnchor: [0, 0],
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
                <div className="text-sm w-56">
                  <div className="font-bold text-base mb-1">{dp.name}</div>
                  <div className="text-gray-400 text-xs mb-1">
                    Event Time:{" "}
                    {dp.eventTime
                      ? new Date(dp.eventTime).toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="text-gray-500 text-xs mb-1">ID: {dp._id}</div>
                  <div className="text-gray-400 text-xs mb-1">
                    Created:{" "}
                    {dp.createdAt
                      ? new Date(dp.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                  {dp.GPSlocation && (
                    <div className="text-gray-400 text-xs mb-1">
                      GPS: [{dp.GPSlocation.coordinates[0]},{" "}
                      {dp.GPSlocation.coordinates[1]}]
                    </div>
                  )}
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
