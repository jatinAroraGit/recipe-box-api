const Sequelize = require('sequelize');
const mysql = require('mysql');
const apiKey = require('../../config/apiKey.json')
/* 
sequelize-auto -h "mymysql.senecacollege.ca" -d "schemaName" -u "username" -x "password"  -o "./test-models" -t "userRecipes" -C
*/

//Code to connect to phpMyAdmin
connectDatabase = function () {
  const connection = mysql.createConnection({
    host: 'mymysql.senecacollege.ca',
    user: apiKey.dbUsername,
    password: apiKey.dbPass,
    database: apiKey.dbUsername
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });
}

// Code for connecting to database via sequelize
var sequelize = new Sequelize(apiKey.dbUsername, apiKey.dbUsername, apiKey.dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql'
});
/*
var UserProfile = sequelize.define('UserProfile', {
  userProfileId: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  lastName: Sequelize.STRING,
  firstName: Sequelize.STRING,
  diet: Sequelize.STRING
});
*/

module.exports.initialize = function () {
  connectDatabase();
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(function (UserProfile) {
      console.log('Connection has been established with User database!!');
      resolve();
    }).catch(function (err) {
      reject("unable to sync the database");
    });
  });
};

