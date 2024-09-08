const express = require("express");
const router = express.Router();
const Episode = require("../models/Episode");
const Stream = require("../models/Stream"); // Assuming you have a Stream model
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// applying all the route authentication
router.use(authMiddleware);

// Create a new episode
router.post("/", async (req, res) => {
  try {
    const episode = new Episode(req.body);
    await episode.save();
    res.status(201).json(episode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all episodes
router.get("/", async (req, res) => {
  try {
    const episodes = await Episode.find();
    res.status(200).json(episodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get an episode by ID
router.get("/:id", async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });
    res.status(200).json(episode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all streams of an episode by episode ID
router.get("/:id/streams", async (req, res) => {
  try {
    const streams = await Stream.find({ episodeId: req.params.id });
    if (!streams || streams.length === 0) {
      return res
        .status(404)
        .json({ message: "No streams found for this episode" });
    }
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an episode by ID
router.patch("/:id", async (req, res) => {
  try {
    const episode = await Episode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!episode) return res.status(404).json({ message: "Episode not found" });
    res.status(200).json(episode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an episode by ID
router.delete("/:id", async (req, res) => {
  try {
    const episode = await Episode.findByIdAndDelete(req.params.id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });
    res.status(200).json({ message: "Episode deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload thumbnail for an episode
router.post(
  "/:id/upload-thumbnail",
  upload.single("thumbnail"),

  async (req, res) => {
    try {
      const { id } = req.params;
      const { file } = req;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const episode = await Episode.findById(id);
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }

      episode.thumbnail_id = file.filename; // Save the filename to the database
      await episode.save();

      res.status(200).json(episode);
    } catch (error) {
      console.error("Error uploading file:", error); // Log the error
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
