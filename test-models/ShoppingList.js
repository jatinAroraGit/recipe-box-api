/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoppingList', {
    listId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'listId'
    },
    listItems: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'listItems'
    },
    userId: {
      type: DataTypes.STRING(1111),
      allowNull: false,
      unique: true,
      field: 'userId'
    }
  }, {
    tableName: 'ShoppingList'
  });
};
