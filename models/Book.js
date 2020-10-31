const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: "string",
    required: "title is required",
  },
  description: {
    type: "string",
    required: "description is required",
  },
  author: {
    type: "string",
    required: "author is required",
  },
  img: {
    type: "string",
  },
  rating: {
    type: "number",
    default: 0,
  },
  nb_voters: {
    type: "number",
    default: 0,
  },
});

const Book = mongoose.model("book", BookSchema);
module.exports = Book;
