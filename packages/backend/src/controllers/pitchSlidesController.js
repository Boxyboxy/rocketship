const {
  createPitchSlide,
  deletePitchSlide,
  updatePitchSlide,
} = require("../repositories/pitchSlidesRepository");

module.exports = {
  async createPitchSlide(req, res) {
    const newPitchSlide = await createPitchSlide({ ...req.body });

    return res.json(newPitchSlide);
  },
  async deletePitchSlide(req, res) {
    const { id } = req.params;
    const deleteResult = await deletePitchSlide(id);

    if (!deleteResult) {
      const error = new Error(
        `Could not delete pitch slide with pitch slide ID ${id}`
      );
      error.status = 400;
      throw error;
    }

    res.json({ success: true });
  },
  async updatePitchSlide(req, res) {
    const { id } = req.params;
    // +id converts a string to number
    if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
      const error = new Error("id  must be a valid number");
      error.status = 400;
      throw error;
    }
    const updatedResult = await updatePitchSlide(id, req.body);

    if (!updatedResult) {
      const error = new Error(`Could not update pitch slide with ID ${id}`);
      error.status = 400;
      throw error;
    }
    res.json({ success: true });
  },
};
