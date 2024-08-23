const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Series",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Season", seasonSchema);
