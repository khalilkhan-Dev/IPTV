const mongoose = require("mongoose");

const genresSeriesSchema = new mongoose.Schema({
  genreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Series",
    required: true,
  },
});

module.exports = mongoose.model("GenresSeries", genresSeriesSchema);
