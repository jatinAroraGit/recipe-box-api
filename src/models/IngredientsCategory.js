/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ingredientsCategory', {
    ingredientCategoryId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'ingredientCategoryId'
    },
    categoryDesc: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'categoryDesc'
    },
    categoryType: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'categoryType'
    }
  }, {
    tableName: 'IngredientsCategory'
  });
};
