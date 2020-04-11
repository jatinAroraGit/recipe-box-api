var axios = require('axios');
const apiKey = process.env.secret;
const keys = require('../../config/apiKey.json')

const { Sequelize, Model, DataTypes, Op } = require("sequelize");
/* Important steps to connect to db instance and update it */

var db = new Sequelize('prj666_201a04', keys.dbUsername, keys.dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

var UserAccount = db.import('../models/UserAccount.js');
var UserRecipes = db.import('../models/UserRecipes.js');
var Cookbook = db.import('../models/Cookbook.js');
var ShoppingList = db.import('../models/ShoppingList.js');
var RecipeIngredients = db.import('../models/RecipeIngredients.js');
var UserRecipeInstructions = db.import('../models/UserRecipeInstructions.js');

exports.userAccountCreatePOST = async function (req, res) {
  res.type('application/json')
  console.log('CREATING USER \n');
  const data = req.body;
  // var user = JSON.parse(data);
  //console.log(user.email);
  // console.log(req.body.email);
  await UserAccount.create(req.body).then(async () => {

    await ShoppingList.create({ userId: req.body.uid }).then(async () => {
      res.send('Done');
    }).catch((err) => {
      res.send('failed');
    });
    console.log('Created');
  }).catch((err) => {
    res.send(err);
    console.log(err);

  });

};
exports.getUserAccountById = async function (req, res) {
  console.log('Getting User By UID');
  console.log(req.body.id);
  try {
    const row = await UserAccount.findOne(
      {
        where: req.body,
        raw: true
      }

    );
    console.log("RESULT:: " + JSON.stringify(row));
    res.send(JSON.stringify(row));
  } catch (err) {
    console.log(err);
    res.send('Error' + err);
  }
};

exports.userAccountDeletePOST = function (req, res) {


  UserAccount.destroy({
    where: { userEmail: req.body.userEmail }
  });
  UserRecipes.destroy({
    where: { userId: req.body.userId }
  })
  UserRecipeInstructions.destroy({
    where: { userId: req.body.userId }
  })
  Cookbook.destroy({
    where: { userId: req.body.userId }
  });
  UserRecipes.destroy({
    where: { userId: req.body.userId }
  })

  ShoppingList.destroy({
    where: { userId: req.body.userId }
  })
    .then(() => {
      res.send("Success");
    })
    .catch(() => {
      res.send("Error! User was not deleted");
    })
}