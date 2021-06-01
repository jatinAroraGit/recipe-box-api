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
var sequelize = new Sequelize("recipes", apiKey.dbUsername, apiKey.dbPass, {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql'
});
var Cookbook = sequelize.import('../models/Cookbook.js')
var IngredientsCategory = sequelize.import('../models/IngredientsCategory.js')
var RecipeIngredients = sequelize.import('../models/RecipeIngredients.js')
var ShoppingList = sequelize.import('../models/ShoppingList.js')
var UnitOfMeasure = sequelize.import('../models/UnitOfMeasure.js')
var UserAccount = sequelize.import('../models/UserAccount.js');
var UserProfiles = sequelize.import('../models/UserProfiles.js');
var UserRecipeInstructions = sequelize.import('../models/UserRecipeInstructions.js');
var UserRecipes = sequelize.import('../models/UserRecipes.js');
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
    sequelize.sync().then(async function (UserProfile) {
      console.log('Connection has been established with User database!!');
      await Cookbook.sync({ force: true });
      await IngredientsCategory.sync({ force: true });
      await RecipeIngredients.sync({ force: true });
      await ShoppingList.sync({ force: true });
      await UnitOfMeasure.sync({ force: true });
      await UserAccount.sync({ force: true });
      await UserProfiles.sync({ force: true });
      await UserRecipeInstructions.sync({ force: true });
      await UserRecipes.sync({ force: true });

      resolve();
    }).catch(function (err) {
      reject("unable to sync the database" + err);
    });
  });
};

