/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userRecipeInstructions', {
    recipeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'recipeId'
    },
    uid: {
      type: DataTypes.STRING(11),
      allowNull: false,
      field: 'uid'
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'userId'
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'instructions'
    },
    instructionId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'instructionId'
    }
  }, {
    tableName: 'UserRecipeInstructions'
  });
};
