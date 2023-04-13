const express = require("express");
const bodyParser = require("body-parser");

const { initializeMiddleware, errorHandler } = require("./middleware");
const { PORT } = require("./configs");
const appRouter = require("./routers");

const app = express();

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
