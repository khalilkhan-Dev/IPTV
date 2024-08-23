const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  seasonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Season",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail_id: {
    type: String,
  },
});

module.exports = mongoose.model("Episode", episodeSchema);
