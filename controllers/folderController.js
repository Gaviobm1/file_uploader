const path = require("path");
const fs = require("fs");
const multer = require("multer");
const File = require("../db/folderQueries");

const db = new File();
exports.rootFolder = path.join(__dirname, "../", "uploads");

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
    res.redirect(`users/${req.user.id}`);
  },
];

exports.createRootFolder = async (user) => {
  const { id } = user;
  const filePath = path.join(this.rootFolder, String(id));
  fs.mkdir(path.join(filePath), { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Root directory created");
    }
  });
  await db.createFolder(filePath, id);
};

exports.createFolder = async (req, res) => {
  const filePath = path.join(
    this.rootFolder,
    String(req.user.id),
    req.body.create_folder
  );
  fs.mkdir(path.join(filePath), { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Directory created");
    }
  });
  const userId = Number(req.user.id);
  await db.createFolder(filePath, userId);
  const contents = await db.findAllFolders(userId);
  res.redirect(`users/${req.user.id}`);
};

exports.deleteFolder = async (req, res) => {
  const folderPath = path.join(
    this.rootFolder,
    String(req.user.id),
    req.body.create_folder
  );
  fs.rm(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Directory deleted");
    }
  });
  await db.deleteFolder(folderPath);
  res.redirect(`users/${req.user.id}`);
};

exports.renameFolder = async (req, res) => {
  const oldPath = path.join(
    this.rootFolder,
    String(req.user.id),
    req.body.old_name
  );
  const newPath = path.join(
    this.rootFolder,
    String(req.user.id),
    req.body.new_name
  );
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Directory renamed");
    }
  });
  await db.renameFolder(oldPath, newPath);
  res.redirect(`users/${req.user.id}`);
};
