import type { Datapoint } from "../../types/datapoint";
import { config } from "../../config";
import React, { useState } from "react";
import datapointService from "../../services/datapointService";
import { useAppDispatch, useAppSelector } from "../../reduxHooks";
import { update } from "../../slices/datapointSlice";

interface DatapointViewerProps {
  datapointId: string | undefined;
  onUpdate?: (updated: Datapoint) => void;
}

const DatapointEditor: React.FC<{
  form: { name: string; description: string; eventTime: string };
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
      className="mb-2 px-2 py-1 rounded bg-[#222] text-white w-full"
      name="name"
      value={form.name}
      onChange={onChange}
      disabled={saving}
      placeholder="Name"
    />
    <textarea
      className="mb-2 px-2 py-1 rounded bg-[#222] text-white w-full"
      name="description"
      value={form.description}
      onChange={onChange}
      disabled={saving}
      placeholder="Description"
      rows={2}
    />
    <input
      className="mb-2 px-2 py-1 rounded bg-[#222] text-white w-full"
      name="eventTime"
      type="datetime-local"
      value={form.eventTime ? form.eventTime.slice(0, 16) : ""}
      onChange={onChange}
      disabled={saving}
    />
    <div className="flex gap-2 mt-2">
      <button
        className="bg-blue-600 text-white px-4 py-1 rounded"
        onClick={onSave}
        disabled={saving}
      >
        Save
      </button>
      <button
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

const DatapointViewer = ({
  datapointId,
  onUpdate,
}: DatapointViewerProps) => {
  const datapoint = useAppSelector((state) =>
    state.datapoints.value.find((dp: Datapoint) => dp._id === datapointId)
  );

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: datapoint?.name || "",
    description: datapoint?.description || "",
    eventTime: datapoint?.eventTime || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    setForm({
      name: datapoint?.name || "",
      description: datapoint?.description || "",
      eventTime: datapoint?.eventTime || "",
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
      const res = await datapointService.updateDatapoint(datapoint._id, {
        name: form.name,
        description: form.description,
        eventTime: form.eventTime,
      });
      setEditMode(false);
      if (onUpdate) onUpdate(res.data);
    } catch (err: any) {
      setError("Failed to update datapoint.");
    } finally {
      setSaving(false);
      dispatch(update({ ...datapoint, ...form }));
    }
  };
  return (
    <div className="flex-1 flex flex-col bg-[#101010] p-4 rounded overflow-hidden">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src={`${config.API_BASE_URL}/images/${datapoint.filename}`}
          alt={datapoint.name}
          className="object-contain w-full h-full" 
        />
      </div>
      <div
        className="w-full bg-[#121212] p-4 rounded-b flex flex-col border-t border-[#222]"
        style={{ minHeight: "120px" }}
      >
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
              <p>{datapoint.name}</p>
              <button
                className="ml-2 text-xs bg-gray-900 px-2 py-1 rounded ml-auto"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            </div>
            <div className="text-gray-400 text-sm mb-1">
              Event Time:{" "}
              {datapoint.eventTime
                ? new Date(datapoint.eventTime).toLocaleString()
                : "N/A"}
            </div>
            <div className="text-gray-300 text-sm mb-1">
              Description: {datapoint.description || "No description"}
            </div>
            <hr className="w-full border-t border-[#333] my-2" />
            <div className="text-gray-500 text-xs mt-1">
              ID: {datapoint._id}
            </div>
            <div className="text-gray-400 text-sm mb-1">
              Created: {new Date(datapoint.createdAt).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DatapointViewer;
