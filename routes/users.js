const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
let bcrypt = require("bcryptjs");
let User = require("../models/user");
const passport = require("passport");
router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  [
    check("name").isLength({ min: 1 }).trim().withMessage("Name Is Required !"),
    check("email").isLength({ min: 1 }).trim().withMessage("Email Required !"),
    check("email").isEmail().trim().withMessage("Email Is Not Valid !"),
    check("username")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Username Is Required !"),
    check("password")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Password Is Required !"),
    check("password").custom((value, { req, loc, path }) => {
      if (value !== req.body.password2) {
        throw new Error("Passwords Do Not Match !");
      } else {
        return value;
      }
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("register", {
        errors: errors.mapped(),
      });
    } else {
      const name = req.body.name;
      const email = req.body.email;
      const username = req.body.username;
      const password = req.body.password;
      let newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password,
      });
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
          if (err) {
            console.log(err);
          }
          newUser.password = hash;
          newUser.save((err) => {
            if (err) throw err;
            req.flash("success", "Registered Successfully ! Please Login .");
            res.redirect("/users/login");
          });
        });
      });
    }
  }
);
router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", (req, res , next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success', "You are Logged Out Successfully !");
  res.redirect('/users/login');
})
module.exports = router;
