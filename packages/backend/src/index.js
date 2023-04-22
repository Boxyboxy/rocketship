const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initializeSockets } = require("./sockets");

// const seqIndex = require("./db/models");
const { initializeMiddleware, errorHandler } = require("./middleware");
const { PORT } = require("./configs");
const { SOCKETS_PORT } = require("./configs");
const appRouter = require("./routers");

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

initializeMiddleware(app);
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);

app.use("/", appRouter);

app.use(errorHandler);

const initializeApp = async () => {
  // trying to Intialize Sequelize but it doesn't work
  // await seqIndex.initializeSequelize();

  // Initialize sockets
  initializeSockets(io);

  http.listen(PORT, () => {
    console.log(`🚀 App listening on the port ${PORT}`);
  });
};

initializeApp();
