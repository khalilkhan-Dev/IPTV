const express = require("express");
const User = require("../models/User");
const Stream = require("../models/Stream");
const Episode = require("../models/Episode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/registration", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    res.send({ token });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update user by ID
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all streams of a user by user ID
router.get("/:id/streams", async (req, res) => {
  try {
    const streams = await Stream.find({ userId: req.params.id });
    if (!streams || streams.length === 0)
      return res.status(404).send("No streams found for this user");
    res.send(streams);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get episodes of all streams of a user by user ID
router.get("/:id/streams/episode", async (req, res) => {
  try {
    // Fetch all streams for the user
    const streams = await Stream.find({ userId: req.params.id });

    if (!streams || streams.length === 0)
      return res.status(404).send("No streams found for this user");

    // Fetch episodes for each stream
    const episodes = await Episode.find({
      streamId: { $in: streams.map((stream) => stream._id) },
    });

    if (!episodes || episodes.length === 0)
      return res.status(404).send("No episodes found for this user's streams");

    res.send(episodes);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
