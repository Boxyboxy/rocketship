const express = require("express");

const pitchSlidesController = require("../controllers/pitchSlidesController");

const pitchSlidesRouter = express.Router();
pitchSlidesRouter.get("/", pitchSlidesController.getAllPitchSlides);
pitchSlidesRouter.post("/", pitchSlidesController.createPitchSlide);
pitchSlidesRouter.delete("/:id", pitchSlidesController.deletePitchSlideById);
pitchSlidesRouter.delete(
  "/",
  pitchSlidesController.deletePitchSlidesByProjectId
);

pitchSlidesRouter.patch("/:id", pitchSlidesController.updatePitchSlide);
module.exports = pitchSlidesRouter;
