/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('recipeIngredients', {
    ingredientId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'ingredientId'
    },
    recipeUid: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'recipeUID'
    },
    ingredientName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'ingredientName'
    },
    quantityUsed: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'quantityUsed'
    },
    unitOfMeasure: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'unitOfMeasure'
    }
  }, {
      tableName: 'RecipeIngredients'
    });
};
