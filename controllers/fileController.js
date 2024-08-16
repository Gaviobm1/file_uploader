const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

exports.uploadSingleLocal = [
  upload.single("file_upload"),
  (req, res) => {
    res.render("home", { user: req.user });
  },
];
