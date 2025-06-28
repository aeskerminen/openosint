import type { ImageDatapoint } from "../../types/imageDatapoint";
import { config } from "../../config";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { update } from "../../slices/imageDatapointSlice";
import imageDatapointService from "../../services/imageDatapointService";
import ImageDatapointEditor from "./components/ImageDatapointEditor";
import ImageExifContainer from "./components/ImageExifContainer";
import ImageDatapointDataContainer from "./components/ImageDatapointDataContainer";

interface DatapointViewerProps {
  datapointId: string | undefined;
  onUpdate?: (updated: ImageDatapoint) => void;
}

const DatapointViewer = ({ datapointId, onUpdate }: DatapointViewerProps) => {
  const datapoint = useAppSelector((state) =>
    state.imageDatapoints.value.find(
      (dp: ImageDatapoint) => dp._id === datapointId
    )
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
        <div className="flex-1">
          {editMode ? (
            <ImageDatapointEditor
              form={form}
              onChange={handleChange}
              onSave={handleSave}
              onCancel={() => setEditMode(false)}
              saving={saving}
              error={error}
            />
          ) : (
            <ImageDatapointDataContainer
              datapoint={datapoint}
              setEditMode={setEditMode}
            ></ImageDatapointDataContainer>
          )}
        </div>
        <ImageExifContainer datapoint={datapoint}></ImageExifContainer>
      </div>
    </div>
  );
};

export default DatapointViewer;
