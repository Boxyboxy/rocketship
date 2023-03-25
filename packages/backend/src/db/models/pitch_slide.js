'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pitch_slide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  pitch_slide.init({
    project_id: DataTypes.INTEGER,
    url_string: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pitch_slide',
    underscored: true,
  });
  return pitch_slide;
};