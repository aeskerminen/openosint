import db from "../mongodb.js";
import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: false, _id: false }
);

const pointModel = mongoose.model("point", pointSchema);

export default pointModel;
export { pointSchema };
