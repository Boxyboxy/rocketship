require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8080,
  SOCKETS_PORT: process.env.SOCKETS_PORT || 8081,
};
