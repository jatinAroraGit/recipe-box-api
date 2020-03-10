/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userAccount', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    uid: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'uid'
    },
    userEmail: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: 'userEmail'
    },
    securityQuestion: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      field: 'securityQuestion'
    },
    response: {
      type: DataTypes.STRING(10000),
      allowNull: false,
      field: 'response'
    }
  }, {
    tableName: 'UserAccount'
  });
};
