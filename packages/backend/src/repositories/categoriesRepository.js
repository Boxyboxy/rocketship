const { category } = require("../db/models");
const logger = require("../middleware/logger");

module.exports = {
  getAllCategories() {
    return category.findAll();
  },

  getCategoryById(id) {
    const options = {};
    if (id) options.where = { id: id };
    return category.findOne(options);
  },
};
