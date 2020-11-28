const { validationResult } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const { allowedTags } = require("./static-data");

module.exports.checkValidate = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, msg: "Invalide input", error: errors.errors });
  }
  next();
};

module.exports.checkID = function (req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res
      .status(400)
      .json({ msg: "invalid recource ID", id: req.params.id });
  }

  next();
};

module.exports.checkTags = function (req, res, next) {
  let err = [];
  if (req.body.tags) {
    req.body.tags.forEach((tag) => {
      if (!allowedTags.includes(tag)) {
        err.push({ msg: `invalid tag [${tag}]` });
      }
    });
  }
  if (err.length > 0)
    return res
      .status(400)
      .json({ success: false, msg: `invalid tag`, error: err });

  next();
};
