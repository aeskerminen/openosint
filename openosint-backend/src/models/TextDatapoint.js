const mongoose = require("mongoose");

const TextDatapointSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    raw_text: {
      type: String,
      required: true,
    },
    source: {
      platform: { type: String },
      url: { type: String },
      username: { type: String },
    },
    language: {
      type: String,
      default: "unknown",
    },
    translation: {
      type: String,
    },
    eventTime: {
      type: Date,
      default: Date.now,
    },

    location: {
      name: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      source: { type: String, enum: ["user", "NER"], default: "user" },
    },
    tags: [String],
    entities: {
      persons: [String],
      organizations: [String],
      locations: [String],
    },
    sentiment: {
      type: String,
      enum: ["positive", "neutral", "negative"],
    },
    confidence: {
      sentiment: { type: Number, min: 0, max: 1 },
      location_match: { type: Number, min: 0, max: 1 },
      entity_recognition: { type: Number, min: 0, max: 1 },
    },
    notes: {
      type: String,
    },
    linked_image_ids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImageDatapoint",
      },
    ],
  },
  { timestamps: true, _id: true }
);

const TextDatapointModel = mongoose.model("TextDatapoint", TextDatapointSchema);
module.exports = TextDatapointModel;
