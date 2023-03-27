const { pitchSlide } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllPitchSlides(options) {
    return pitchSlide.findAll(options);
  },
  async createPitchSlide(payload) {
    const currentDate = new Date();

    return pitchSlide.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },

  deletePitchSlideById(id) {
    return pitchSlide.destroy({
      where: {
        id: id,
      },
    });
  },

  deletePitchSlidesByProjectId(projectId) {
    return pitchSlide.destroy({
      where: {
        projectId: projectId,
      },
    });
  },
  updatePitchSlide(id, payload) {
    return pitchSlide.update(
      { ...payload, update_at: new Date() },
      {
        where: {
          id: id,
        },
      }
    );
  },
};
