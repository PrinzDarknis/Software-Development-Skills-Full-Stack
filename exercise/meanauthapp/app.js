// Never use it like this, it is just an inspiration.
// It's follows mustly an Tutorial and has many things which can and should be done better.

try {
  require("dotenv").config(); // in try becouse only dev dependency
} catch {}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors"); // allows request to different domains
const passport = require("passport");
const mongoose = require("mongoose");

const users = require("./routes/users");

// DB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to Database");
});
mongoose.connection.on("error", (err) => {
  console.log("Database Error: " + err);
});

const app = express();

// Middleware Cors
app.use(cors());

// static Frontend
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(bodyParser.json());

// Middleware Passport
app.use(passport.initialize());
app.use(passport.session());
require("./passport")(passport);

// Routes
app.use("/users", users);

// All else handeld by Frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`);
});
