var axios = require('axios');
const urlBase = "https://api.spoonacular.com/recipes/"
const apiKey = process.env.secret;
const keys = require('../../config/apiKey.json')
var sanitizeHtml = require('sanitize-html');
var stripHtml = require('string-strip-html');

var rr = require('../routing/routes')
var querystring = require("querystring");
//const recipeModel = require("../models/UserRecipes");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const recipeController = require('./recipeController');
let recipeResults = [];
let RecipeDetails = require('../recipeDetails.js');
let Ingredients = require('../ingredients');
let Steps = require('../steps');
var db = new Sequelize(keys.dbUsername, keys.dbUsername, keys.dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});
var UserRecipes = db.import('../models/UserRecipes.js');
var UserAccount = db.import('../models/UserAccount.js');
var Cookbook = db.import('../models/Cookbook.js');
var RecipeIngredients = db.import('../models/RecipeIngredients.js');
var UserRecipeInstructions = db.import('../models/UserRecipeInstructions.js');
let globalUid = ""
exports.createCookbook = async function (req, res) {
  //recipeController.recipeAddToUserPOST(req);
  let data = req.body;
  // let recipe = req.body.recipe;
  let newUserCookbook = await Cookbook.create(req.body);
  let userCookbook = await Cookbook.findOne({
    where: {
      cookbookId: newUserCookbook.cookbookId
    }
  });
  res.send(userCookbook);

}
exports.updateCookbook = async function (req, res) {
  //recipeController.recipeAddToUserPOST(req);
  let data = req.body;
  let recipe = req.body.recipe;
  let userCookbook = await Cookbook.update(req.body.data, {
    where: {
      cookbookId: req.body.cookbookId
    }
  })
  if (req.body.recipes) {
    let newRecipesList = ((userCookbook.recipes) ? userAccount.recipes + ',' : '') + req.body.recipeId;
    await Cookbook.update({ recipes: newRecipesList }, {

      where: {
        cookbookId: req.body.cookbookId
      }
    })
  }
  res.send(userCookbook);

}

exports.allCookbooksByUserId = async function (req, res) {
  let userCookbooks = await Cookbook.findAll({
    where: {
      userId: req.body.userId
    }
  })
  res.send(userCookbooks);
}


exports.cookbookDetailById = async function (req, res) {
  //recipeController.recipeAddToUserPOST(req);
  let data = req.body;
  let recipeIDs = []
  let recipes = [];
  let cookbookDetail = {
    userCookbook: {},
    cookbookRecipes: []
  };

  let userCookbook = await Cookbook.findOne({
    where: {
      cookbookId: req.body.cookbookId
    }
  });
  if (userCookbook.recipes) {
    recipeIDs = userCookbook.recipes.split(',');
    console.log(recipeIDs);
    for (var i = 0; i < recipeIDs.length; i++) {
      let recipe = await userCookbookRecipeDetail(recipeIDs[i]);
      recipes.push(recipe);
    }
  }
  cookbookDetail.userCookbook = userCookbook;
  cookbookDetail.cookbookRecipes = recipes;
  res.send(cookbookDetail);

}

exports.addRecipeToCookbook = async function (req, res) {
  //recipeController.recipeAddToUserPOST(req);
  let data = req.body;
  let recipe = req.body.recipe;
  let userCookbook = await Cookbook.findOne({
    where: {
      cookbookId: req.body.cookbookId
    }
  })
  let newRecipe = await recipeAddToUser(recipe, req.body.userId).then(async (data) => {
    console.log(data);
  });
  newRecipe = globalUid;
  let newRecipesList = ((userCookbook.recipes) ? userCookbook.recipes + ',' : '') + newRecipe;
  await Cookbook.update({ recipes: newRecipesList }, {

    where: {
      cookbookId: req.body.cookbookId
    }
  })
  globalUid = '';


  res.send('Successful Create');

}
exports.addUserRecipeToCookbook = async function (req, res) {
  //recipeController.recipeAddToUserPOST(req);
  let data = req.body;
  let recipe = req.body.recipe;
  let userCookbook = await Cookbook.findOne({
    where: {
      cookbookId: req.body.cookbookId
    }
  })
  let newRecipe;
  newRecipe = recipe.id;
  let newRecipesList = ((userCookbook.recipes) ? userCookbook.recipes + ',' : '') + newRecipe;
  await Cookbook.update({ recipes: newRecipesList }, {

    where: {
      cookbookId: req.body.cookbookId
    }
  })
  globalUid = '';


  res.send('Successful Create');

}


exports.deleteCookbookById = async function (req, res) {
  let userCookbooks = await Cookbook.findAll({
    where: {
      userId: req.body.userId
    }
  })
  res.send(userCookbooks);
}

exports.deleteCookbookRecipe = async function (req, res) {
  let cookbook = await Cookbook.findOne({
    where: {
      cookbookId: req.body.cookbookId,
      userId: req.body.userId
    }
  })

  let recipesStr = cookbook.recipes.split(',');
  if (recipesStr) {
    for (var i = 0; i < recipesStr.length; i++) {
      if (recipesStr[i] == req.body.recipeId) {
        recipesStr.splice(i, 1);
      }
    }
    let newRecipeIds = "";
    if (recipesStr.length > 1) {

      for (var i = 0; i < recipesStr.length; i++) {
        if (i == recipesStr.length - 1)
          newRecipeIds = newRecipeIds + recipesStr[i];
        else
          newRecipeIds = newRecipeIds + recipesStr[i] + ',';
      }
    }
    else if (recipesStr.length == 1) {
      newRecipeIds = newRecipeIds + recipesStr[0];
    }
    else {
      newRecipeIds = '';
    }

    await Cookbook.update({ recipes: newRecipeIds }, {
      where: {
        cookbookId: req.body.cookbookId
      }
    });


  }

  res.send('Success');
}

exports.updateCookbookInfo = async function (req, res) {
  let data = {
    title: req.body.title,
    description: req.body.description
  }

  await Cookbook.update(data, {
    where: {
      userId: req.body.userId,
      cookbookId: req.body.cookbookId
    }
  })
  res.send('Success');
}

exports.deleteCookbook = async function (req, res) {

  await Cookbook.destroy({
    where: {
      userId: req.body.userId,
      cookbookId: req.body.cookbookId
    }
  })
  res.send('Success');
}

// Static Functions

async function userCookbookRecipeDetail(recipeId) {
  var response;
  // console.log('Sending API Request to : '+ urlBase+req.params.id+'/information');
  var id = "";
  id = id + recipeId;
  if (id.charAt(0) != 'U') {
    try {
      recipe = await axios.get(urlBase + id + '/information?apiKey=' + keys.key);
      let recipeDetail = new RecipeDetails(recipe.data.id, false, recipe.data.sourceName, recipe.data.title, recipe.data.summary, recipe.data.servings, recipe.data.readyInMinutes, recipe.data.image, "", (recipe.data.cuisines) ? recipe.data.cuisines[0] : "", (recipe.data.dishTypes) ? recipe.data.dishTypes[0] : "", false, "");
      recipe.data.extendedIngredients.forEach(i => {
        let newIngredient = new Ingredients(i.id, i.name, i.amount, i.unit)
        recipeDetail.includedIngredients.push(newIngredient);
      });
      console.log(recipe.data.analyzedInstructions);
      await recipe.data.analyzedInstructions.forEach(s => {
        console.log(s);
        for (var i = 0; i < s.steps.length; i++) {
          var step = s.steps[i];
          let newStep;
          if (i == 0)
            newStep = new Steps(step.number, step.step, s.name);
          else
            newStep = new Steps(step.number, step.step, "");
          recipeDetail.instructions.push(newStep);
        }

      })
      res.send(recipeDetail);
    } catch (error) {
      console.error(error);
    }
  }
  else
    if (id.charAt(0) == 'U') {
      let recipe = await getUserRecipe(id);
      const ingredients = await RecipeIngredients.findAll({
        where: {
          recipeUid: id,
        },

      });

      let recipeDetail = new RecipeDetails(recipe.uid, true, recipe.sourceName, recipe.recipeTitle, recipe.summary, recipe.servings, recipe.readyInMinutes, recipe.recipeImage, "", recipe.cuisine, recipe.mealType, (recipe.isPublished == 1) ? true : false, recipe.userId);
      console.log(ingredients);
      ingredients.forEach(i => {
        let newIngredient = new Ingredients(i.ingredientId, i.ingredientName, i.quantityUsed, i.unitOfMeasure)
        recipeDetail.includedIngredients.push(newIngredient);
      });
      const steps = await UserRecipeInstructions.findAll({
        where: {
          uid: id
        },

      });
      steps.forEach(s => {
        let newStep = new Steps(s.instructionId, s.description, "");
        recipeDetail.instructions.push(newStep);
      });
      return recipeDetail;

    };
};

async function getUserRecipe(uid) {
  let recipe = await UserRecipes.findOne({
    where: {
      uid: uid
    },
    raw: true
  });
  return recipe;
}

async function recipeAddToUser(data, userId_) {
  console.log('Adding RECIPE for cookbook \n');

  //let tempRecipe = await getRecipeDetails(data.id);
  // console.log(tempRecipe);
  // res.send();
  let recipeTitle = data.title;
  let userId = userId_;
  let image = data.image;
  delete data.image;
  data.recipeImage = image;
  let originalSummary = data.summary;
  var cleanSummary = sanitizeHtml(originalSummary);
  let pureTextSummary = stripHtml(cleanSummary);
  data.summary = pureTextSummary;
  console.log('New Summary:: \n' + data.summary);
  delete data.userRecipe;
  delete data.id;
  delete data.title;
  data.recipeTitle = recipeTitle;
  data.isPublished = false;
  console.log(data);
  //res.send();


  let isPosted = false

  await UserRecipes.create(data).then(async tableData => {
    let userRecipe = tableData;
    userRecipe.uid = "U" + userRecipe.id;
    await userRecipe.save();

    isPosted = true;
    let ingredients = [];
    let steps = [];
    if (data.includedIngredients) {
      ingredients = data.includedIngredients;
    }
    else if (data.ingredients) {
      ingredients = data.ingredients;
    }

    if (data.instructions) {
      for (var i = 0; i < data.instructions.length; i++) {
        steps[i] = data.instructions[i].description;
      }
    }
    else if (data.steps) {
      steps = data.steps;
    }

    console.log(userRecipe);



    if (ingredients) {
      for (var i = 0; i < ingredients.length; i++) {
        let sendData = {
          "recipeId": userRecipe.id,
          "recipeUid": userRecipe.uid,
          "ingredientName": ingredients[i].name,
          "quantityUsed": ingredients[i].amount,
          "unitOfMeasure": ingredients[i].unit

        }
        console.log("Sending Data to DB", sendData);
        await RecipeIngredients.create(sendData);

      }
    }

    if (steps) {
      for (var i = 0; i < steps.length; i++) {
        let sendData = {
          "recipeId": userRecipe.id,
          "uid": userRecipe.uid,
          "userId": userId,
          "description": steps[i],
          "specialInfo": "",

        }
        await UserRecipeInstructions.create(sendData);

      }
    }
    let userAccount = await UserAccount.findOne({ where: { uid: userId } });
    console.log(userAccount);
    let newRecipesList = ((userAccount.userRecipes) ? userAccount.userRecipes + ',' : '') + userRecipe.uid;


    await UserAccount.update({ userRecipes: newRecipesList }, {

      where: {
        uid: userId
      }
    }).then(() => {
      globalUid = userRecipe.uid;
      return userRecipe.uid;
    });




  }).catch((err) => {
    // res.send("There was an error saving your recipe." + err);
    console.log(err);
  });

  console.log('Posted');


}