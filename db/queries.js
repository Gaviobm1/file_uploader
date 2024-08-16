const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient();

class User {
  async addUser(user) {
    const { firstName, lastName, email, password } = user;
    return prisma.user
      .create({
        data: {
          firstName,
          lastName,
          email,
          password,
        },
      })
      .then((newUser) => newUser)
      .catch((err) => console.log(err));
  }
  async findUser(email) {
    return prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((user) => user)
      .catch((err) => {
        console.log(err);
      });
  }
  async findUserById(id) {
    return prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then((data) => data)
      .catch((err) => console.log(err));
  }
  async checkForExistingEmail(email) {
    return prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((data) => {
        if (data) {
          return true;
        }
        return false;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async getAllUsers() {
    return prisma.user
      .findMany()
      .then((data) => {
        if (data) {
          return data;
        }
        console.log("No entries yet");
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
