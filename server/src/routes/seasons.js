const express = require("express");
const router = express.Router();
const Season = require("../models/Season");
const Episode = require("../models/Episode"); // Assuming you have an Episode model

// Create a new season
router.post("/", async (req, res) => {
  const { seriesId, name, description } = req.body;

  if (!seriesId || !name) {
    return res.status(400).json({ message: "Series ID and name are required" });
  }

  try {
    const season = new Season({ seriesId, name, description });
    await season.save();
    res.status(201).json(season);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all seasons
router.get("/", async (req, res) => {
  try {
    const seasons = await Season.find();
    res.status(200).json(seasons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a season by ID
router.get("/:id", async (req, res) => {
  try {
    const season = await Season.findById(req.params.id);
    if (!season) return res.status(404).json({ message: "Season not found" });
    res.status(200).json(season);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all episodes of a season by season ID
router.get("/:id/episodes", async (req, res) => {
  try {
    const episodes = await Episode.find({ season: req.params.id });
    if (!episodes || episodes.length === 0) {
      return res
        .status(404)
        .json({ message: "No episodes found for this season" });
    }
    res.status(200).json(episodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a season by ID
router.patch("/:id", async (req, res) => {
  try {
    const season = await Season.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!season) return res.status(404).json({ message: "Season not found" });
    res.status(200).json(season);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a season by ID
router.delete("/:id", async (req, res) => {
  try {
    const season = await Season.findByIdAndDelete(req.params.id);
    if (!season) return res.status(404).json({ message: "Season not found" });
    res.status(200).json({ message: "Season deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
