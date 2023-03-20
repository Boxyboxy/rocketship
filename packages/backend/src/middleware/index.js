const cors = require("cors");
const { json } = require("express");
const { requestLogger } = require("./logger");

module.exports = {
  initializeMiddleware: (app) => {
    app.use(cors());
    app.use(json());
    app.use(requestLogger);
  },
  ...require("./errorHandler"),
};
