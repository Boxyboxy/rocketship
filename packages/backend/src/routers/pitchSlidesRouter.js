const express = require("express");

const pitchSlidesController = require("../controllers/pitchSlidesController");

const pitchSlidesRouter = express.Router();

pitchSlidesRouter.post("/:productId", pitchSlidesController.createPitchSlide);

pitchSlidesRouter.delete("/:id", pitchSlidesController.deletePitchSlide);

pitchSlidesRouter.patch("/:id", pitchSlidesController.updatePitchSlide);
module.exports = pitchSlidesRouter;
