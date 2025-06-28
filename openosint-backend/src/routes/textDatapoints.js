import express from "express";
import TextDatapointModel from "../models/TextDatapoint.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const raw_datapoint = { title: req.body.title, raw_text: req.body.raw_text };

  try {
    const textDatapoint = await TextDatapointModel.create(raw_datapoint);
    res.status(201).json(textDatapoint);
  } catch (err) {
    console.error("Error creating text datapoint:", err);
    res.status(500).send("Error creating text datapoint").end();
  }
});

router.get("/", async (req, res) => {
  try {
    const datapoints = await TextDatapointModel.find({});
    res.status(200).json(datapoints).end();
  } catch (err) {
    console.error("Error fetching text datapoints:", err);
    res.status(500).send("Error fetching text datapoints").end();
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const datapoint = await TextDatapointModel.findByIdAndDelete(req.params.id);
    if (!datapoint) {
      return res.status(404).json({ error: "TextDatapoint not found" });
    }
    res.status(200).json({ message: "TextDatapoint deleted" });
  } catch (err) {
    console.error("Error deleting text datapoint:", err);
    res.status(500).json({ error: "Error deleting text datapoint" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedDatapoint = await TextDatapointModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedDatapoint) {
      return res.status(404).json({ error: "TextDatapoint not found" });
    }
    res.status(200).json(updatedDatapoint);
  } catch (err) {
    console.error("Error updating text datapoint:", err);
    res.status(500).json({ error: "Error updating text datapoint" });
  }
});

export default router;
