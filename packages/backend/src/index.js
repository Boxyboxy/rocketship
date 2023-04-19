const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { initializeSockets } = require("./sockets");

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

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});

const initializeApp = async () => {
  // // Intialize Sequelize
  // await initializeSequelize();

  // Initialize sockets
  initializeSockets(io);

  http.listen(SOCKETS_PORT, () => {
    console.log(`🚀 App listening on the port ${SOCKETS_PORT}`);
  });
};

initializeApp();
