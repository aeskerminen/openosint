import axios from "axios";
import { config } from "../config";
import type { TextDatapoint } from "../types/textDatapoint";

const textDatapointUrl = `${config.API_BASE_URL}/textDatapoints`;

const getTextDatapoints = async () => {
  return axios.get<TextDatapoint[]>(textDatapointUrl);
};

const uploadTextDatapoint = async (data: Partial<TextDatapoint>) => {
  return axios.post(textDatapointUrl, data);
};


const updateTextDatapoint = async (
  id: string,
  data: Partial<TextDatapoint>
) => {
  return axios.put(`${textDatapointUrl}/${id}`, data);
};

const removeTextDatapoint = async (id: string) => {
  return axios.delete(`${textDatapointUrl}/${id}`);
};

const textDatapointService = {
  getTextDatapoints,
  uploadTextDatapoint,
  updateTextDatapoint,
  removeTextDatapoint,
};

export default textDatapointService;
