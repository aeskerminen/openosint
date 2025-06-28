import React from "react";
import { useAppSelector } from "../../reduxHooks";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { selectAllImageDatapoints } from "../../slices/imageDatapointSlice";
import L from "leaflet";
import "./leaflet_custom_icons.css";

const customMarkerIcon = L.divIcon({
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, 0],
  shadowSize: [0, 0],
  className: "animated-icon default-custom-icon",
});

const customSelectedMarkerIcon = L.divIcon({
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, 0],
  shadowSize: [0, 0],
  className: "animated-icon selected-custom-icon",
});

interface DatapointMapProps {
  datapointId: string | undefined;
}

const DatapointMap: React.FC<DatapointMapProps> = ({ datapointId }) => {
  const datapoints = useAppSelector(selectAllImageDatapoints);

  return (
    <div
      data-testid="datapoint-map-container"
      className="flex-1 flex-col h-full bg-[#101010] p-4 rounded flex items-center justify-center text-gray-400"
    >
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[60.16, 24.9]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
        />
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          opacity={0.8}
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
              icon={
                dp._id === datapointId
                  ? customSelectedMarkerIcon
                  : customMarkerIcon
              }
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold text-base">{dp.name}</div>
                  <div>
                    Event Time:
                    {dp.eventTime
                      ? new Date(dp.eventTime).toLocaleString()
                      : "N/A"}
                  </div>
                  <div>ID: {dp._id}</div>
                  <div>
                    Created:
                    {dp.createdAt
                      ? new Date(dp.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                  {dp.GPSlocation && (
                    <div>
                      GPS: [{dp.GPSlocation.coordinates[0]},
                      {dp.GPSlocation.coordinates[1]}]
                    </div>
                  )}
                  <button
                    className="bg-blue-600 text-white p-1 rounded mt-2"
                    onClick={() => {}}
                  >
                    Details
                  </button>
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
