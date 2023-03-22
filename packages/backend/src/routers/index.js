require("express-async-errors");
const express = require("express");

const categoriesRouter = require("./categoriesRouter");
// const productsRouter = require("./productsRouter");
// const productImagesRouter = require("./productImagesRouter");
// const usersRouter = require("./usersRouter");
// const userAddressesRouter = require("./userAddressesRouter");
// const ordersRouter = require("./ordersRouter");
// const orderItemsRouter = require("./orderItemsRouter");
const appRouter = express.Router();

appRouter.use("/categories", categoriesRouter);
// appRouter.use("/products", productsRouter);
// appRouter.use("/images", productImagesRouter);
// appRouter.use("/users", usersRouter);
// appRouter.use("/addresses", userAddressesRouter);
// appRouter.use("/orders", ordersRouter);
// appRouter.use("/orderItems", orderItemsRouter);
module.exports = appRouter;
