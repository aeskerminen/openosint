import axios from "axios";
import { config } from "../../../config";


const uploadDatapoint = async (datapoint : FormData) => {
    const req = axios.post(`${config.API_BASE_URL}/datapoints/upload`, datapoint, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return req;
};

const removeDatapoint = async (datapointId: string) => {
    const req = axios.delete(`${config.API_BASE_URL}/datapoints/${datapointId}`);
    return req;
}

const datapointService = {
    uploadDatapoint,
    removeDatapoint
};

export default datapointService;