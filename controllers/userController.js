const User = require("../db/userQueries");
const Folder = require("../db/folderQueries");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const folderController = require("./folderController");

const db = new User();
const folderDb = new Folder();

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
      const newUser = await db.addUser(user);
      await folderController.createRootFolder(newUser);
      res.render("home", { user });
    });
  }),
];

exports.signin = [
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect(`users/${req.user.id}`);
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

exports.homepage = asyncHandler(async (req, res, next) => {
  const path = `${folderController.rootFolder}/${req.user.id}`;
  fs.readdir(path, (err, contents) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", { user: req.user, contents });
    }
  });
});
