const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const genreRoutes = require("./routes/genreRoutes");
const seriesRoutes = require("./routes/series");
const genreSeriesRoutes = require("./routes/genresSeries");
const seasonsRoutes = require("./routes/seasons");
const episodesRoutes = require("./routes/episodes");
const streamsRoutes = require("./routes/streams");
// const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");
// const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/practiceIptv", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Routes
app.use("/users", userRoutes);
app.use("/genres", genreRoutes);
app.use("/series", seriesRoutes);
app.use("/genres-series", genreSeriesRoutes);
app.use("/seasons", seasonsRoutes);
app.use("/episodes", episodesRoutes);
app.use("/streams", streamsRoutes);
// app.use(
//   "/uploads",
//   authMiddleware,
//   express.static(path.join(__dirname, "uploads"))
// );

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
