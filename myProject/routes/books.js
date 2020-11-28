const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");

const { checkID } = require("../middleware");
const logger = require("../logger");
const User = require("../models/user");
const booksController = require("../controller/books");

const router = express.Router();

// Get All
router.get("/", booksController.MW_checkSearchFilter, booksController.all);

// Get One
router.get("/:id", [checkID, booksController.MW_getBookByID], (req, res) =>
  res.json(res.book)
);

//Create
router.post(
  "/",
  [passport.authenticate("jwt", { session: false })].concat(
    booksController.MW_checkCreate
  ),
  booksController.create
);

// Update
router.patch(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkID,
  ].concat(booksController.MW_checkUpdate, [booksController.MW_getBookByID]),
  booksController.update
);

// Delete
router.delete(
  "/:id",
  [
    passport.authenticate("jwt", { session: false }),
    checkID,
    booksController.MW_getBookByID,
  ],
  booksController.delete
);

module.exports = router;
