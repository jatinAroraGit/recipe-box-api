const keys = require('../../config/apiKey.json');
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
var recipeController = require('../controllers/recipeController');
var CookBook = db.import('../models/Cookbook.js');

let cookbook = [];

var db = new Sequelize(keys.dbUsername, keys.dbUsername, keys.dbPass, {
    host: 'mymysql.senecacollege.ca',
    dialect: 'mysql',
    define: {
      timestamps: false
    }
  });

exports.cookbookTest = async function (req, res) {
    console.log('TEST Cookbook \n');
    let data = req.body;
    
    console.log(data);
  
    CookBook.findAll({
      where: req.body,
      include: [{
        where: { cookbookId: 1 }
      }]
    }).then(data => {
      console.log(data);
    });
}

exports.cookbookCreatePOST = async function (req, res) {
    console.log('Creatin New Cookbook \n');
    let data = req.body;
    console.log(data);

    let newCookbook;

    await CookBook.create(data).then(async tableData => {
      newCookbook = tableData
      await newCookbook.save().then(async () => {
  
        console.log("Cookbook finalized");
  
        console.log(newCookbook);
        if (data.recipes.length > 0) {
          for (var i = 0; i < data.ingredients.length; i++) {
            let sendData = {
              "cookbookId": newCookbook.cookbookId,
              "userId": newCookbook.userId,
            //  "title": ,          unsure
            //  "recipes": ,        unsure
            //  "descirption":      unsure
            }
            console.log("Sending Data to DB", sendData);
            await RecipeIngredients.create(sendData);
  
          }
        }
        res.send('Successful Create' + data);
    });
      res.send("There was an error saving your cookbook." + err);
      console.log(err);
    });

}

exports.cookbookUpdatePOST = async function (req, res) {
    console.log('Updating Cookbook \n');
    let data = req.body;
  
    console.log(data);
    await CookBook.update(data, {
     
        returning: true
    
    }).then(async () => {

      console.log("Cookbook updated");
      if (data.recipes.length > 0) {

        for (var i = 0; i < data.recipes.length; i++) {
            let sendData = {
                "cookbookId": newCookbook.cookbookId,
                "userId": newCookbook.userId,
              //  "title": ,          unsure
              //  "recipes": ,        unsure
              //  "descirption":      unsure
              }
          console.log("Sending Data to DB", sendData);
        }
      }
    }).catch(function (err) {
      console.log(err);
    }); 
}

exports.cookbookDeletePOST = function (req, res) {
    res.send('NOT IMPLEMENTED');
};

exports.addRecipeToCookbookPOST = function(req,res){
    res.send('NOT IMPLEMENTED');
};

exports.removeRecipeFromCookbookPOST = function(req,res){
    res.send('NOT IMPLEMENTED');
}