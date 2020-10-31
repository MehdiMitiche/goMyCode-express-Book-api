//Importing dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Initializing  the app
const app = express();

//Importing the Models
const Book = require("./models/Book");

//Connecting the database
mongoose.connect("mongodb://localhost/goMyCodeBook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.once("open", () => {
  console.log("Database connected successfully !");
});

//Body-Parser MiddelWar
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//find a book of a specific author
app.get("/books", (req, res) => {
  let query = {};
  query = req.query.author ? { ...query, author: req.query.author } : query;
  query = req.query.rating ? { ...query, rating: req.query.rating } : query;
  query = req.query.title ? { ...query, title: req.query.title } : query;

  try {
    Book.find(query).then((data, err) => {
      if (err) return res.status(400).json({ message: "Error" });
      return res.status(200).json({ data });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/books", (req, res) => {
  try {
    const newBook = new Book();
    if (!req.body.title || !req.body.description || !req.body.author)
      return res.status(400).json({
        message:
          "title, description and author are all required to add a new Book",
      });
    newBook.title = req.body.title;
    newBook.description = req.body.description;
    newBook.author = req.body.author;
    if (req.body.rating) newBook.rating = req.body.rating;
    if (req.body.nb_voters) newBook.nb_voters = req.body.nb_voters;

    newBook.save().then((data, err) => {
      if (err) return res.status(400).json({ message: "Error" });
      return res.status(200).json({ data });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/books", (req, res) => {
  if (!req.body.id || !req.body.data)
    return res
      .status(400)
      .json({ message: "data and id are required to update a Book" });
  try {
    Book.updateOne(
      { _id: req.body.id },
      {
        ...req.body.data,
      }
    ).then((data, err) => {
      if (err) return res.status(400).json({ message: "Error" });
      return res.status(200).json({ message: "Updated successfully !", data });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/books", (req, res) => {
  if (!req.body.id)
    return res.status(400).json({ message: "id is required to delete a Book" });
  try {
    Book.deleteOne({ _id: req.body.id }).then((data, err) => {
      if (err) return res.status(400).json({ message: "Error" });
      return res.status(200).json({ message: "Deleted successfully !", data });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("API running in port 8080");
});
