const express = require("express");
const router = express.Router();
const Series = require("../models/Series");
const Season = require("../models/Season"); // Assuming you have a Season model
const Episode = require("../models/Episode"); // Assuming you have an Episode model
const upload = require("../middleware/upload");

// Create a new series
router.post("/", async (req, res) => {
  try {
    const series = new Series(req.body);
    await series.save();
    res.status(201).json(series);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all series
router.get("/", async (req, res) => {
  try {
    const series = await Series.find();
    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a series by ID
router.get("/:id", async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    if (!series) return res.status(404).json({ message: "Series not found" });
    res.status(200).json(series);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all seasons of a series by series ID
router.get("/:id/seasons", async (req, res) => {
  try {
    const seasons = await Season.find({ series: req.params.id });
    if (!seasons || seasons.length === 0) {
      return res
        .status(404)
        .json({ message: "No seasons found for this series" });
    }
    res.status(200).json(seasons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all episodes of a series by series ID
router.get("/:id/seasons/episodes", async (req, res) => {
  try {
    const seasons = await Season.find({ series: req.params.id });
    if (!seasons || seasons.length === 0) {
      return res
        .status(404)
        .json({ message: "No seasons found for this series" });
    }

    const episodes = await Episode.find({
      season: { $in: seasons.map((s) => s._id) },
    });
    if (!episodes || episodes.length === 0) {
      return res
        .status(404)
        .json({ message: "No episodes found for these seasons" });
    }

    res.status(200).json(episodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a series by ID
router.patch("/:id", async (req, res) => {
  try {
    const series = await Series.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!series) return res.status(404).json({ message: "Series not found" });
    res.status(200).json(series);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a series by ID
router.delete("/:id", async (req, res) => {
  try {
    const series = await Series.findByIdAndDelete(req.params.id);
    if (!series) return res.status(404).json({ message: "Series not found" });
    res.status(200).json({ message: "Series deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload thumbnail and trailer
router.post(
  "/upload",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { thumbnail, trailer } = req.files;
      const { seriesId } = req.body; // Assuming you pass the series ID in the request body

      if (!seriesId) {
        return res.status(400).json({ message: "Series ID is required" });
      }

      const series = await Series.findById(seriesId);
      if (!series) {
        return res.status(404).json({ message: "Series not found" });
      }

      series.thumbnail_id = thumbnail
        ? thumbnail[0].filename
        : series.thumbnail_id;
      series.trailer_id = trailer ? trailer[0].filename : series.trailer_id;

      await series.save();
      res.status(200).json(series);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
