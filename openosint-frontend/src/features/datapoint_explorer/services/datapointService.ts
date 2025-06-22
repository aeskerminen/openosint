import axios from "axios";
import { config } from "../../../config";
import type { Datapoint } from "../../../types/datapoint";

const uploadDatapoint = async (datapoint: FormData) => {
  const req = axios.post(
    `${config.API_BASE_URL}/datapoints/upload`,
    datapoint,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return req;
};

const removeDatapoint = async (datapointId: string) => {
  const req = axios.delete(`${config.API_BASE_URL}/datapoints/${datapointId}`);
  return req;
};

const updateDatapoint = async (
  datapointId: string,
  updatedData: Partial<Datapoint>
) => {
  const req = axios.put(
    `${config.API_BASE_URL}/datapoints/${datapointId}`,
    updatedData
  );
  return req;
};

const datapointService = {
  uploadDatapoint,
  updateDatapoint,
  removeDatapoint,
};

export default datapointService;
