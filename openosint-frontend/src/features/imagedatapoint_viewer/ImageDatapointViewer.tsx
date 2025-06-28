import type { ImageDatapoint } from "../../types/imageDatapoint";
import { config } from "../../config";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { update } from "../../slices/imageDatapointSlice";
import imageDatapointService from "../../services/imageDatapointService";

interface DatapointViewerProps {
  datapointId: string | undefined;
  onUpdate?: (updated: ImageDatapoint) => void;
}

const DatapointEditor: React.FC<{
  form: {
    name: string;
    description: string;
    eventTime: string;
    longitude: string;
    latitude: string;
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  error: string | null;
}> = ({ form, onChange, onSave, onCancel, saving, error }) => (
  <>
    <input
      data-testid="datapoint-viewer-attribute-name-edit"
      className="mb-2 px-2 py-1 rounded bg-[#222] text-white w-full"
      name="name"
      value={form.name}
      onChange={onChange}
      disabled={saving}
      placeholder="Name"
    />
    <textarea
      data-testid="datapoint-viewer-attribute-description-edit"
      className="mb-2 px-2 py-1 rounded bg-[#222] text-white w-full"
      name="description"
      value={form.description}
      onChange={onChange}
      disabled={saving}
      placeholder="Description"
      rows={2}
    />
    <input
      data-testid="datapoint-viewer-attribute-eventtime-edit"
      className="mb-2 px-2 py-1 rounded bg-[#222] text-white w-full"
      name="eventTime"
      type="datetime-local"
      value={form.eventTime ? form.eventTime.slice(0, 16) : ""}
      onChange={onChange}
      disabled={saving}
    />
    <div className="flex gap-2 mb-2">
      <input
        data-testid="datapoint-viewer-attribute-longitude-edit"
        className="px-2 py-1 rounded bg-[#222] text-white w-full"
        name="longitude"
        type="number"
        step="any"
        value={form.longitude}
        onChange={onChange}
        disabled={saving}
        placeholder="Longitude"
      />
      <input
        data-testid="datapoint-viewer-attribute-latitude-edit"
        className="px-2 py-1 rounded bg-[#222] text-white w-full"
        name="latitude"
        type="number"
        step="any"
        value={form.latitude}
        onChange={onChange}
        disabled={saving}
        placeholder="Latitude"
      />
    </div>
    <div className="flex gap-2 mt-2">
      <button
        data-testid="datapoint-viewer-save-button"
        className="bg-blue-600 text-white px-4 py-1 rounded"
        onClick={onSave}
        disabled={saving}
      >
        Save
      </button>
      <button
        data-testid="datapoint-viewer-cancel-button"
        className="bg-gray-600 text-white px-4 py-1 rounded"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
    </div>
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </>
);

const DatapointViewer = ({ datapointId, onUpdate }: DatapointViewerProps) => {
  const datapoint = useAppSelector((state) =>
    state.imageDatapoints.value.find((dp: ImageDatapoint) => dp._id === datapointId)
  );

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: datapoint?.name || "",
    description: datapoint?.description || "",
    eventTime: datapoint?.eventTime || "",
    longitude: datapoint?.GPSlocation?.coordinates?.[0]?.toString() || "",
    latitude: datapoint?.GPSlocation?.coordinates?.[1]?.toString() || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    setForm({
      name: datapoint?.name || "",
      description: datapoint?.description || "",
      eventTime: datapoint?.eventTime || "",
      longitude: datapoint?.GPSlocation?.coordinates?.[0]?.toString() || "",
      latitude: datapoint?.GPSlocation?.coordinates?.[1]?.toString() || "",
    });
    setEditMode(false);
    setError(null);
  }, [datapoint]);

  if (!datapoint) {
    return (
      <div className="flex-1 flex-col bg-[#101010] p-4 rounded flex items-center justify-center text-gray-400">
        Select a datapoint to view its image.
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const hasValidCoords =
        form.longitude !== "" &&
        form.latitude !== "" &&
        !isNaN(Number(form.longitude)) &&
        !isNaN(Number(form.latitude));

      const gps = hasValidCoords
        ? {
            type: "Point" as const,
            coordinates: [
              parseFloat(form.longitude),
              parseFloat(form.latitude),
            ] as [number, number],
          }
        : undefined;
      const res = await imageDatapointService.updateImageDatapoint(
        datapoint._id,
        {
          name: form.name,
          description: form.description,
          eventTime: form.eventTime,
          GPSlocation: gps,
        }
      );
      setEditMode(false);
      if (onUpdate) onUpdate(res.data);
      // Update Redux with correct GPSlocation object
      dispatch(
        update({
          ...datapoint,
          name: form.name,
          description: form.description,
          eventTime: form.eventTime,
          GPSlocation: gps,
        })
      );
    } catch (err: any) {
      setError("Failed to update datapoint.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex-1 flex flex-col bg-[#101010] p-4 rounded overflow-hidden">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          data-testid="datapoint-viewer-image"
          src={`${config.API_BASE_URL}/images/${datapoint.filename}`}
          alt={datapoint.name}
          className="object-contain w-full h-full"
        />
      </div>
      <div
        className="w-full bg-[#121212] p-4 rounded-b flex flex-row border-t border-[#222] gap-4"
        style={{ minHeight: "120px" }}
      >
        {/* Left: original info and edit */}
        <div className="flex-1 flex flex-col min-w-0">
          {editMode ? (
            <DatapointEditor
              form={form}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => setEditMode(false)}
              saving={saving}
              error={error}
            />
          ) : (
            <>
              <div className="text-white text-lg font-bold flex items-center gap-2 w-full">
                <p data-testid="datapoint-viewer-attribute-name">
                  {datapoint.name}
                </p>
                <button
                  className="ml-2 text-xs bg-gray-900 px-2 py-1 rounded ml-auto"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              </div>
              <div className="text-gray-400 text-sm mb-1">
                Event Time:
                <span data-testid="datapoint-viewer-attribute-eventtime">
                  {datapoint.eventTime
                    ? new Date(datapoint.eventTime).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="text-gray-300 text-sm mb-1">
                Description:
                <span data-testid="datapoint-viewer-attribute-description">
                  {datapoint.description || "No description"}
                </span>
              </div>
              <div className="text-gray-300 text-sm mb-1">
                GPS Location:
                <span data-testid="datapoint-viewer-attribute-longitude">
                  {datapoint.GPSlocation
                    ? `${datapoint.GPSlocation.coordinates[0]}`
                    : "N/A"}
                </span>
                <span>,</span>
                <span data-testid="datapoint-viewer-attribute-latitude">
                  {datapoint.GPSlocation
                    ? `${datapoint.GPSlocation.coordinates[1]}`
                    : "N/A"}
                </span>
              </div>
              <hr className="w-full border-t border-[#333] my-2" />
              <div className="text-gray-500 text-xs mt-1">
                ID:
                <span data-testid="datapoint-viewer-attribute-id">
                  {datapoint._id}
                </span>
              </div>
              <div className="text-gray-400 text-sm mb-1">
                Created:
                <span data-testid="datapoint-viewer-attribute-createdat">
                  {new Date(datapoint.createdAt).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>
        {/* Right: EXIF data */}
        <div className="flex-1 flex flex-col min-w-0 border-l border-[#222] pl-4">
          <div className="text-white text-lg font-bold mb-2">EXIF Data</div>
          <div className="text-xs text-gray-300 whitespace-pre-wrap break-all overflow-y-auto max-h-48">
            {datapoint.exifData
              ? (() => {
                  try {
                    const parsed = JSON.parse(datapoint.exifData);
                    return (
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(parsed, null, 2)}
                      </pre>
                    );
                  } catch {
                    return datapoint.exifData;
                  }
                })()
              : "No EXIF data available."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatapointViewer;
