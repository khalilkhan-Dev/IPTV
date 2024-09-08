const express = require("express");
const router = express.Router();
const Stream = require("../models/Stream");
const Episode = require("../models/Episode");
const User = require("../models/User"); // Assuming you have a User model
const Season = require("../models/Season");
const Series = require("../models/Series");
const Genre = require("../models/Genre");
const authMiddleware = require("../middleware/authMiddleware");

// applying all the route authentication
router.use(authMiddleware);

// Create a new stream
router.post("/", async (req, res) => {
  try {
    const stream = new Stream(req.body);
    await stream.save();
    res.status(201).json(stream);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all streams
router.get("/", async (req, res) => {
  try {
    const streams = await Stream.find();
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a stream by ID
router.get("/:id", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the episode of a stream by stream ID
router.get("/:id/episode", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id).populate("episodeId");
    if (!stream || !stream.episodeId) {
      return res
        .status(404)
        .json({ message: "Episode not found for this stream" });
    }
    res.status(200).json(stream.episodeId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the user of a stream by stream ID
router.get("/:id/user", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id).populate("userId");
    if (!stream || !stream.userId) {
      return res
        .status(404)
        .json({ message: "User not found for this stream" });
    }
    res.status(200).json(stream.userId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the season of an episode of a stream by stream ID
router.get("/:id/episode/season", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id).populate({
      path: "episodeId",
      populate: { path: "seasonId" },
    });
    if (!stream || !stream.episodeId || !stream.episodeId.seasonId) {
      return res
        .status(404)
        .json({ message: "Season not found for this stream" });
    }
    res.status(200).json(stream.episodeId.seasonId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the series of a season of an episode of a stream by stream ID
router.get("/:id/episode/season/series", async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id).populate({
      path: "episodeId",
      populate: {
        path: "seasonId",
        populate: { path: "seriesId" },
      },
    });
    if (
      !stream ||
      !stream.episodeId ||
      !stream.episodeId.seasonId ||
      !stream.episodeId.seasonId.seriesId
    ) {
      return res
        .status(404)
        .json({ message: "Series not found for this stream" });
    }
    res.status(200).json(stream.episodeId.seasonId.seriesId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get the genre of a series of a season of an episode of a stream by stream ID
router.get(
  "/:id/episode/season/series/genre",

  async (req, res) => {
    try {
      const stream = await Stream.findById(req.params.id).populate({
        path: "episodeId",
        populate: {
          path: "seasonId",
          populate: {
            path: "seriesId",
            populate: { path: "genreIds" },
          },
        },
      });
      if (
        !stream ||
        !stream.episodeId ||
        !stream.episodeId.seasonId ||
        !stream.episodeId.seasonId.seriesId ||
        !stream.episodeId.seasonId.seriesId.genreIds
      ) {
        return res
          .status(404)
          .json({ message: "Genre not found for this stream" });
      }
      res.status(200).json(stream.episodeId.seasonId.seriesId.genreIds);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Update a stream by ID
router.patch("/:id", async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    res.status(200).json(stream);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a stream by ID
router.delete("/:id", async (req, res) => {
  try {
    const stream = await Stream.findByIdAndDelete(req.params.id);
    if (!stream) return res.status(404).json({ message: "Stream not found" });
    res.status(200).json({ message: "Stream deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
