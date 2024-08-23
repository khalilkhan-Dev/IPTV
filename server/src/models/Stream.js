const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  episodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Episode",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Stream", streamSchema);
