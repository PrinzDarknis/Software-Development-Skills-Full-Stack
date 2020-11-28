const { check, validationResult } = require("express-validator");

const logger = require("../logger");
const { checkValidate, checkTags } = require("../middleware");
const Book = require("../models/book");

// Get All incl. Filter
exports.all = function (req, res) {
  // Filter Build
  let filter = {};
  if (typeof req.query.title !== "undefined")
    filter.title = { $regex: req.query.title, $options: "i" };
  if (typeof req.query.author !== "undefined")
    filter.author = { $regex: req.query.author, $options: "i" };
  if (typeof req.query.publischer !== "undefined")
    filter.publischer = { $regex: req.query.publischer, $options: "i" };
  if (typeof req.query.year !== "undefined")
    filter.year = { $eq: req.query.year };
  if (typeof req.query.ISBN10 !== "undefined")
    filter.ISBN10 = { $eq: req.query.ISBN10 };
  if (typeof req.query.ISBN13 !== "undefined")
    filter.ISBN13 = { $eq: req.query.ISBN13 };
  if (typeof req.query.category !== "undefined")
    filter.category = { $regex: req.query.category, $options: "i" };
  if (typeof req.query.series !== "undefined")
    filter.series = { $regex: req.query.series, $options: "i" };
  if (typeof req.query.language !== "undefined")
    filter.language = { $regex: req.query.language, $options: "i" };
  if (typeof req.query.tags !== "undefined")
    filter.tags = { $all: req.query.tags };

  // Serach
  Book.getAll(filter, (err, books) => {
    if (err) {
      logger.logError("Can't fetch Books", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    res.json({ success: true, result: books });
  });
};

// Create
exports.create = function (req, res) {
  let book = new Book(req.body);
  book.save((err, newBook) => {
    if (err) {
      logger.logError("Error on create Book", err);
      return res.status(500).json({ success: false, msg: err.message });
    }
    res
      .status(201)
      .json({ success: true, msg: "Book Created", result: newBook });
  });
};

// Update
exports.update = function (req, res) {
  if (typeof req.body.title !== "undefined") res.book.title = req.body.title;
  if (typeof req.body.author !== "undefined") res.book.author = req.body.author;
  if (typeof req.body.publischer !== "undefined")
    res.book.publischer = req.body.publischer;
  if (typeof req.body.year !== "undefined") res.book.year = req.body.year;
  if (typeof req.body.ISBN10 !== "undefined") res.book.ISBN10 = req.body.ISBN10;
  if (typeof req.body.ISBN13 !== "undefined") res.book.ISBN13 = req.body.ISBN13;
  if (typeof req.body.category !== "undefined")
    res.book.category = req.body.category;
  if (typeof req.body.series !== "undefined") res.book.series = req.body.series;
  if (typeof req.body.language !== "undefined")
    res.book.language = req.body.language;
  if (typeof req.body.tags !== "undefined") res.book.tags = req.body.tags;

  res.book.save((err, newBook) => {
    if (err) {
      logger.logError("Error while Update Book", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    res.json({ success: true, msg: "book updated", result: newBook });
  });
};

// Delete
exports.delete = function (req, res) {
  res.book.remove((err, deletedBook) => {
    if (err) {
      logger.logError("Error while delete Book", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    res.json({ success: true, msg: "Deleted Book", deletedBook });
  });
};

// Middleware
exports.MW_checkCreate = [
  check("title").isString().escape().trim(),
  check("author").isString().escape().trim(),
  check("publischer").isString().escape().trim(),
  check("year").isNumeric().toInt(),
  check("ISBN10").isISBN(10).optional(),
  check("ISBN13").isISBN(13).optional(),
  check("category").isString().escape().trim().optional(),
  check("series").isString().escape().trim().optional(),
  check("language").isString().trim().optional(),
  check("tags").isArray().toArray().optional(),
  check("tags.*").isString().trim().optional(),
  checkValidate,
  checkTags,
];

const checkUpdate = [
  check("title").isString().escape().trim().optional(),
  check("author").isString().escape().trim().optional(),
  check("publischer").isString().escape().trim().optional(),
  check("year").isNumeric().toInt().optional(),
  check("ISBN10").isISBN(10).optional(),
  check("ISBN13").isISBN(13).optional(),
  check("category").isString().escape().trim().optional(),
  check("series").isString().escape().trim().optional(),
  check("language").isString().trim().optional(),
  check("tags").isArray().toArray().optional(),
  check("tags.*").isString().trim().optional(),
  checkValidate,
  checkTags,
];

exports.MW_getBookByID = function (req, res, next) {
  // find Book
  Book.findById(req.params.id).exec((err, book) => {
    if (err) {
      logger.logError("Fehler in Get Book by ID", err);
      return res.status(500).json({ success: false, msg: err.message });
    }

    if (book == null) {
      return res.status(404).json({ success: false, msg: "Cannot find Book" });
    }

    res.book = book;
    next();
  });
};

exports.MW_checkUpdate = checkUpdate;
exports.MW_checkSearchFilter = checkUpdate;
