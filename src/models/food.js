'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Food.init({
    name: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    category: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.REAL,
    ingredient: DataTypes.STRING,
    detail: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};