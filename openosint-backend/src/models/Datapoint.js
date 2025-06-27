import db from "../mongodb.js";
import mongoose from "mongoose";
import { pointSchema } from "./Point.js";

const datapointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    eventTime: {
      type: Date,
      default: Date.now,
    },
    exifData: {
      type: String,
      default: "",
    },
    GPSlocation: {
      type: pointSchema,
      required: false,
    },
  },
  { timestamps: true, _id: true }
);

const datapointModel = mongoose.model("Datapoint", datapointSchema);
export default datapointModel;
