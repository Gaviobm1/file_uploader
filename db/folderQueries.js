const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Folder {
  async createFolder(filePath, id) {
    const user = prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then((data) => data)
      .catch((err) => console.log(err));
    prisma.folder
      .create({
        data: {
          ownerId: id,
          path: filePath,
        },
      })
      .then((data) => data)
      .catch((err) => console.log(err));
  }
  async deleteFolder(folderPath) {
    prisma.folder
      .delete({
        where: {
          path: folderPath,
        },
      })
      .then((data) => {
        console.log(`Deleted folder at ${folderPath}`);
      })
      .catch((err) => {
        console.log("Deletion failed");
      });
  }

  async renameFolder(oldFolderPath, newFolderPath) {
    prisma.folder
      .update({
        data: {
          path: newFolderPath,
        },
        where: {
          path: oldFolderPath,
        },
      })
      .then((data) => {
        console.log(`Renamed folder at ${oldFolderPath} to ${newFolderPath}`);
      })
      .catch((err) => {
        console.log("Renaming failed");
      });
  }

  async findAllFolders(id) {
    const folders = await prisma.folder
      .findMany({
        where: {
          ownerId: Number(id),
        },
      })
      .then((data) => data)
      .catch((err) => {
        console.log(err);
      });
    const contents = folders.map((folder) => folder.path);
    return contents;
  }
}

module.exports = Folder;
