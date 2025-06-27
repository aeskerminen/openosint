import axios from "axios";
import { config } from "../config";
import type { Datapoint } from "../types/datapoint";

const imageDatapointUrl = `${config.API_BASE_URL}/imageDatapoints`;

const uploadImageDatapoint = async (datapoint: FormData) => {
  const req = axios.post(`${imageDatapointUrl}`, datapoint, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return req;
};

const getImageDatapoints = async () => {
  const req = axios.get<Datapoint[]>(`${imageDatapointUrl}`);
  return req;
};

const removeImageDatapoint = async (datapointId: string) => {
  const req = axios.delete(`${imageDatapointUrl}/${datapointId}`);
  return req;
};

const updateImageDatapoint = async (
  datapointId: string,
  updatedData: Partial<Datapoint>
) => {
  const req = axios.put(`${imageDatapointUrl}/${datapointId}`, updatedData);
  return req;
};

const imageDatapointService = {
  uploadImageDatapoint,
  updateImageDatapoint,
  removeImageDatapoint,
  getImageDatapoints,
};

export default imageDatapointService;
