const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
const config = require("./config/database");
const port = process.env.PORT || 8080;
const User = require("./models/article");
mongoose.connect(config.database, { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => {
  console.log("Connected To Database !");
});
db.on("error", (err) => {
  console.error(err);
});
let Article = require("./models/article");
const app = express();
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("trust proxy", 1);
app.use(
  session({
    secret: "cookie",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.error(err);
    } else {
      res.render("index", {
        articles: articles,
        title: "Feed",
      });
    }
  });
});
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use("/articles/", articles);
app.use("/users/", users);
app.listen(port, (req, res) => {
  console.log("Server Initialized At Port 8080");
});
