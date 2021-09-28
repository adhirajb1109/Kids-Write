const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
let Article = require("../models/article");
let User = require("../models/user");
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("add", { title: "Add Articles" });
});
router.get("/:id", (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    User.findById(article.author, (err, user) => {
      res.render("article", { article: article, author: user.name });
    });
  });
});
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    if (article.author === req.user._id) {
      req.flash("danger", "Unauthorized");
      res.redirect("/");
    }
    res.render("edit", { article: article, title: "Edit Article" });
  });
});
router.post(
  "/add",
  [
    check("title")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Title Is Required !"),
    check("content")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Content Is Required !"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("add", {
        title: "Add Articles",
        errors: errors.mapped(),
      });
    } else {
      let article = new Article();
      article.title = req.body.title;
      article.author = req.user._id;
      article.content = req.body.content;
      article.save((err) => {
        if (err) {
          console.error(err);
        } else {
          req.flash("success", "Article Added Successfully !");
          res.redirect("/");
        }
      });
    }
  }
);
router.post("/edit/:id", (req, res) => {
  let article = {};
  let query = { _id: req.params.id };
  article.title = req.body.title;
  article.author = req.body.author;
  article.content = req.body.content;
  Article.updateOne(query, article, (err) => {
    if (err) {
      console.error(err);
    } else {
      req.flash("success", "Article Updated Successfully !");
      res.redirect("/");
    }
  });
});
router.delete("/:id", (req, res) => {
  let query = { _id: req.params.id };
  if (!req.user._id) {
    req.flash("danger", "Unauthorized");
    res.redirect("/");
  }
  Article.findById(req.params.id, (err, article) => {
    if (article.author === req.user._id) {
      req.flash("danger", "Unauthorized");
      res.redirect("/");
    } else {
      Article.deleteOne(query, (err) => {
        if (err) {
          console.error(err);
        } else {
          res.send("Success !");
        }
      });
    }
  });
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "Please Login To Use This Functionality !");
    res.redirect("/users/login");
  }
}
module.exports = router;