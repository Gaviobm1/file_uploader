const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const User = require("./queries");

const db = new User();

async function testConnection() {
  db.findUser("tim@timson.es")
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log("Failed to connect");
    });
}

testConnection();
