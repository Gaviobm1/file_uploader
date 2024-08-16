const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const fileController = require("../controllers/fileController");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/sign-in", userController.signin);

router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

router.post("/sign-up", userController.createUser);

router.get("/sign-out", userController.signout);

router.post("/upload-file", fileController.uploadSingleLocal);

module.exports = router;
