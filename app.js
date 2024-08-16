const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("./helpers/passportStrategy");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const prismaSession = require("./db/sessionStore");
const User = require("./db/queries");
const path = require("path");
require("dotenv").config();

const db = new User();
const fileRouter = require("./routes/fileRouter");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);
app.use(passport.session());
passport.use(localStrategy);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  db.findUserById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});
app.use(fileRouter);
app.listen(8080, () => {
  console.log("Listening on 8080");
});
