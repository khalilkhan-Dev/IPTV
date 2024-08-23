const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  trailer_id: {
    type: String,
  },
  thumbnail_id: {
    type: String,
  },
  releaseDate: {
    type: Date,
  },
  genreIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
});

module.exports = mongoose.model("Series", seriesSchema);
