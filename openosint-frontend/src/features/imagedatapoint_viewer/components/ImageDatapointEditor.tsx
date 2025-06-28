interface ImageDatapointEditorProps {
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
}

const ImageDatapointEditor: React.FC<ImageDatapointEditorProps> = ({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
  error,
}) => (
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

export default ImageDatapointEditor;
