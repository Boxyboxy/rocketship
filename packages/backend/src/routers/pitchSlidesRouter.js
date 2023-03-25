const express = require("express");

const pitchSlidesController = require("../controllers/pitchSlidesController");

const pitchSlidesRouter = express.Router();

pitchSlidesRouter.get("/", pitchSlidesController.getAllPitchSlides);

pitchSlidesRouter.get("/:id", pitchSlidesController.getPitchSlideById);
pitchSlidesRouter.post("/", pitchSlidesController.createPitchSlide);
pitchSlidesRouter.delete("/:id", pitchSlidesController.deletePitchSlide);
module.exports = pitchSlidesRouter;
