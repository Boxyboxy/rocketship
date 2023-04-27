const {
  getAllCategories,
  getCategoryById,
} = require("../repositories/categoriesRepository");

module.exports = {
  async getAllCategories(req, res) {
    try {
      const categories = await getAllCategories();

      return res.json(categories);
    } catch (err) {
      console.error(err);
    }
  },
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      // +id converts a string to number
      if (isNaN(id) || +id > Number.MAX_SAFE_INTEGER || +id < 0) {
        const error = new Error("Category Id must be a valid number");
        error.status = 400;
        throw error;
      }

      const category = await getCategoryById(id);
      if (!category) {
        const error = new Error(
          `Could not find category with category id ${id}`
        );
        error.status = 400;
        throw error;
      }

      return res.json(category);
    } catch (err) {
      console.error(err);
    }
  },
};
