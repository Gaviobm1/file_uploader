const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../db/queries");

const db = new User();

const verifyCallback = (email, password, done) => {
  db.findUser(email)
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "No user with that email" });
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { message: "Passwords do not match" });
        })
        .catch((err) => done(err));
    })
    .catch((err) => done(err));
};

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  verifyCallback
);

module.exports = localStrategy;
