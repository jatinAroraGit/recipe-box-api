/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('unitOfMeasure', {
    unitOfMeasure: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      field: 'unitOfMeasure'
    },
    description: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'description'
    }
  }, {
    tableName: 'UnitOfMeasure'
  });
};
