const mongoose = require("mongoose");

const { allowedTags } = require("../static-data");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publischer: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  ISBN10: {
    type: String,
  },
  ISBN13: {
    type: String,
  },
  category: {
    type: String,
  },
  series: {
    type: String,
  },
  language: {
    type: String,
  },
  tags: [
    {
      type: String,
      enum: allowedTags,
    },
  ],
});

bookSchema.static("getAll", function (filter, callback) {
  Book.find(filter)
    .collation({ locale: "en" }) // case insensive sort
    .sort({ title: "asc" })
    .exec(callback);
});

const Book = (module.exports = mongoose.model("Books", bookSchema));
