/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
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
      unique: true,
      field: 'uid'
    },
    userEmail: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
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
    },
    userRecipes: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      field: 'userRecipes'
    },
    userCookbooks: {
      type: DataTypes.STRING(2000),
      allowNull: true,
      field: 'userCookbooks'
    }
  }, {
      tableName: 'UserAccount'
    });
};
