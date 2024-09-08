const express = require("express");
const model = require("../models/User");
const Stream = require("../models/Stream");
const Episode = require("../models/Episode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register a new user
// Register a new user
router.post("/registration", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await model.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new model({ username, email, password: hashedPassword });
    await user.save();

    // Generate the JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, "khalil", { expiresIn: "1h" });

    // Return the token in a JSON object
    res.status(201).json({ token });
  } catch (error) {
    console.log("error is:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await model.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // generating jwt for login
    const payload = { userId: user._id };
    const token = jwt.sign(payload, "khalil", { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// applying all the route authentication
router.use(authMiddleware);

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await model.find().select("-password");
    res.send(users);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await model.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update user by ID
router.patch("/:id", async (req, res) => {
  try {
    const user = await model
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .select("-password");
    if (!user) return res.status(404).send("User not found");
    res.send(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const user = await model.findByIdAndDelete(req.params.id);
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
