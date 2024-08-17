const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const folderController = require("../controllers/folderController");

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/sign-in", userController.signin);

router.get("/users/:id", userController.homepage);

router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

router.post("/sign-up", userController.createUser);

router.get("/sign-out", userController.signout);

router.post("/upload-file", folderController.uploadSingleLocal);

router.post("/create-folder", folderController.createFolder);
router.post("/delete-folder", folderController.deleteFolder);
router.post("/rename-folder", folderController.renameFolder);

module.exports = router;
