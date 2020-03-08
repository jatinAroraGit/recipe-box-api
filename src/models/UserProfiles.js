/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userProfiles', {
    userProfileId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'userProfileId'
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'lastName'
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'firstName'
    },
    diet: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'diet'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'createdAt'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updatedAt'
    }
  }, {
    tableName: 'UserProfiles'
  });
};
