const { pitchSlide } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  async createPitchSlide(payload) {
    const currentDate = new Date();

    return productImage.create({
      ...payload,
      created_at: currentDate,
      updated_at: currentDate,
    });
  },

  deletePitchSlide(id) {
    return pitchSlide.destroy({
      where: {
        id: id,
      },
    });
  },

  deletePitchSlideById(productId) {
    return pitchSlide.destroy({
      where: {
        productId: productId,
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
