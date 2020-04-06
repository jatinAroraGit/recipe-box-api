/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('userRecipes', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    uid: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'uid'
    },
    userId: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: 'userId'
    },
    recipeTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'Untitled',
      field: 'recipeTitle'
    },
    summary: {
      type: DataTypes.STRING(10000),
      allowNull: true,
      field: 'summary'
    },
    recipeImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'recipeImage'
    },
    recipeRating: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'recipeRating'
    },
    mealType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'mealType'
    },
    diets: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'diets'
    },
    includeIngredients: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'includeIngredients'
    },
    cuisine: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'cuisine'
    },
    sourceName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'sourceName'
    },
    nutrients: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'nutrients'
    },
    recipeVisibility: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'private',
      field: 'recipeVisibility'
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'creationDate'
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updateDate'
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'specialInstructions'
    },
    customDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'customDetails'
    },
    isPublished: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0',
      field: 'isPublished'
    },
    servings: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'servings'
    },
    readyInMinutes: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'readyInMinutes'
    }
  }, {
      tableName: 'UserRecipes'
    });
};
