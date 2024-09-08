const express = require("express");
const router = express.Router();
const GenresSeries = require("../models/GenresSeries");
const authMiddleware = require("../middleware/authMiddleware");

// applying all the route authentication
router.use(authMiddleware);

// Create a new genre-series association
router.post("/", async (req, res) => {
  try {
    const genresSeries = new GenresSeries(req.body);
    await genresSeries.save();
    res.status(201).json(genresSeries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all genre-series associations
router.get("/", async (req, res) => {
  try {
    const genresSeries = await GenresSeries.find();
    res.status(200).json(genresSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a genre-series association by ID
router.delete("/:id", async (req, res) => {
  try {
    const genresSeries = await GenresSeries.findByIdAndDelete(req.params.id);
    if (!genresSeries)
      return res.status(404).json({ message: "Association not found" });
    res.status(200).json({ message: "Association deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
