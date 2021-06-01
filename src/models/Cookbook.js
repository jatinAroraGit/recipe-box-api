/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('cookbook', {
    cookbookId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'cookbookId'
    },
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'userId'
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'title'
    },
    recipes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'recipes'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'description'
    }
  }, {
    tableName: 'Cookbook'
  });
};
