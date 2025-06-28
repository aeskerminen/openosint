import { useState } from "react";

interface ImageDatapointModalProps {
  setShowModal: (e: boolean) => void;
  handleModalSubmit: (e: any, form: any) => void;
}

export type ImageDatapointForm = {
  name: string;
  description: string;
  eventTime: string;
  longitude: string;
  latitude: string;
  file: File | null;
};

const ImageDatapointModal: React.FC<ImageDatapointModalProps> = ({
  setShowModal,
  handleModalSubmit,
}) => {
  const [form, setForm] = useState<ImageDatapointForm>({
    name: "",
    description: "",
    eventTime: "",
    longitude: "",
    latitude: "",
    file: null as File | null,
  });
  const handleModalInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, file: e.target.files ? e.target.files[0] : null });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        className="bg-[#232323] p-8 rounded-lg shadow-2xl flex flex-col gap-4 min-w-[350px] max-w-[90vw]"
        onSubmit={(e) => handleModalSubmit(e, form)}
        style={{ minWidth: 350 }}
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          Add New Datapoint
        </h2>
        <input
          className="p-2 rounded bg-[#181818] text-white border border-[#444]"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleModalInput}
          required
        />
        <textarea
          className="p-2 rounded bg-[#181818] text-white border border-[#444]"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleModalInput}
          rows={2}
        />
        <input
          className="p-2 rounded bg-[#181818] text-white border border-[#444]"
          name="eventTime"
          type="datetime-local"
          value={form.eventTime}
          onChange={handleModalInput}
        />
        <div className="flex gap-2">
          <input
            className="p-2 rounded bg-[#181818] text-white border border-[#444] flex-1"
            name="longitude"
            placeholder="Longitude"
            value={form.longitude}
            onChange={handleModalInput}
            type="number"
            step="any"
          />
          <input
            className="p-2 rounded bg-[#181818] text-white border border-[#444] flex-1"
            name="latitude"
            placeholder="Latitude"
            value={form.latitude}
            onChange={handleModalInput}
            type="number"
            step="any"
          />
        </div>
        <input
          className="p-2 rounded bg-[#181818] text-white border border-[#444]"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded transition-all"
          >
            Upload
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded transition-all"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageDatapointModal;
