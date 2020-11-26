const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

// Register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err)
      res.status(500).json({ success: false, msg: "Failed to register user" });
    else res.json({ success: true, msg: "User registered" });
  });
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  User.getUserByUsername(req.body.username, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.status(401).json({ success: false, msg: "User not found" });

    User.comparePassword(req.body.password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch)
        return res.status(401).json({ success: false, msg: "Wrong password" });

      const userData = User.plainObject(user);

      const token = jwt.sign(userData, process.env.TOKEN_SECRET, {
        expiresIn: 604800, // 1 week
      });

      res.json({
        success: true,
        token: `JWT ${token}`,
        user: userData,
      });
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: User.plainObject(req.user) });
  }
);

module.exports = router;
