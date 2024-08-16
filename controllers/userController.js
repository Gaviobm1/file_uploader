const User = require("../db/queries");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const db = new User();

const validateUser = [
  body("first_name").trim().isLength({ max: 30, min: 1 }).escape(),
  body("last_name").trim().isLength({ max: 30, min: 1 }).escape(),
  body("email")
    .trim()
    .isEmail()
    .custom(async (email) => {
      db.checkForExistingEmail(email)
        .then((result) => {
          if (result) {
            throw new Error("Email already exists");
          }
          return true;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .escape(),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .escape(),
  body("password_confirm")
    .trim()
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .escape(),
];

exports.createUser = [
  validateUser,
  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const errors = validationResult(req);
      const user = {
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
      };
      if (!errors.isEmpty()) {
        res.render("sign-up", {
          user,
          errors: errors.array(),
        });
      }
      console.log(user);
      await db.addUser(user);
      res.render("home", { user });
    });
  }),
];

exports.signin = [
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    console.log(req.session);
    res.render("home", { user: req.user });
  },
];

exports.signout = asyncHandler((req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
