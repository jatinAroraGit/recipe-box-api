/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoppingList', {
    listId: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      field: 'listId'
    },
    listItems: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      field: 'listItems'
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'userId'
    }
  }, {
    tableName: 'ShoppingList'
  });
};
