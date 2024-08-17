const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const User = require("./userQueries");
const File = require("./folderQueries");
const fs = require("fs");
const { fstat } = require("fs");

const db = new User();

async function testConnection() {
  prisma.folder
    .findMany()
    .then((data) => console.log(data))
    .catch((err) => console.log(data));
}

function readDirectory(folderPath) {
  fs.readdir(folderPath, (err, contents) => {
    if (err) {
      console.log(err);
    } else {
      console.log(contents);
    }
  });
}

const folderPath = path.join(__dirname, "../", "uploads", "4");

testConnection();
