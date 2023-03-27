const { project } = require("../db/models");
const {
  createPitchSlide,
  getAllPitchSlides,
  deletePitchSlideById,
  deletePitchSlidesByProjectId,
  updatePitchSlide,
} = require("../repositories/pitchSlidesRepository");

module.exports = {
  async getAllPitchSlides({ query }, res) {
    const { projectId } = query;
    const options = {
      include: [{ model: project, where: {} }],
    };

    if (projectId) {
      options.include[0].where.id = projectId;
    }

    const pitchSlides = await getAllPitchSlides(options);

    return res.json(pitchSlides);
  },
  async createPitchSlide(req, res) {
    const newPitchSlide = await createPitchSlide({ ...req.body });

    return res.json(newPitchSlide);
  },
  async deletePitchSlideById(req, res) {
    const { id } = req.params;
    const deleteResult = await deletePitchSlideById(id);

    if (!deleteResult) {
      const error = new Error(
        `Could not delete pitch slide with pitch slide ID ${id}`
      );
      error.status = 400;
      throw error;
    }

    res.json({ success: true });
  },
  async deletePitchSlidesByProjectId({ query }, res) {
    const { projectId } = query;
    const deleteResult = await deletePitchSlidesByProjectId(projectId);

    if (!deleteResult) {
      const error = new Error(
        `Could not delete pitch slide with project ID ${projectId}`
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
