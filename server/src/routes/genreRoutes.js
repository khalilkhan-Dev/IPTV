const express = require("express");
const Genre = require("../models/Genre");
const Series = require("../models/Series"); // Assuming you have a Series model
const Season = require("../models/Season"); // Assuming you have a Season model
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// applying all the route authentication
router.use(authMiddleware);
// Create a new genres
router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Genre name is required");
  }

  try {
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).send("Genre already exists");
    }

    const genre = new Genre({ name });
    await genre.save();
    res.status(201).send(genre);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all genres
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.send(genres);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get a genre by ID
router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all series of a genre by genre ID
router.get("/:id/series", async (req, res) => {
  try {
    const series = await Series.find({ genre: req.params.id });
    if (!series) return res.status(404).send("No series found for this genre");
    res.send(series);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all seasons of all series of a genre by genre ID
router.get("/:id/series/seasons", async (req, res) => {
  try {
    const series = await Series.find({ genre: req.params.id });
    if (!series || series.length === 0)
      return res.status(404).send("No series found for this genre");

    const seasons = await Season.find({
      series: { $in: series.map((s) => s._id) },
    });
    if (!seasons || seasons.length === 0)
      return res.status(404).send("No seasons found for these series");

    res.send(seasons);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update a genre by ID
router.patch("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!genre) return res.status(404).send("Genre not found");
    res.send(genre);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete a genre by ID
router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).send("Genre not found");
    res.send({ message: "Genre deleted successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
