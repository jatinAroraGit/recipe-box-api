/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('storedFilters', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'id'
    },
    filterReligion: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'filterReligion'
    },
    filterRegion: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'filterRegion'
    },
    filterAllergy: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'filterAllergy'
    },
    filterFoodType: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'filterFoodType'
    }
  }, {
    tableName: 'StoredFilters'
  });
};
