//var Recipe = require('../models/Recipe');
// Display list of all Authors.
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
let recipeResults = [];
let RecipeDetails = require('../recipeDetails.js');
let Ingredients = require('../ingredients');
let Steps = require('../steps');
/* Important steps to connect to db instance and update it */
let resultant = {
  recipes: [],
  count: 0
}
var db = new Sequelize(keys.dbUsername, keys.dbUsername, keys.dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});
const resultLimit = 5; // limit of spoonacular api results; 
var UserRecipes = db.import('../models/UserRecipes.js');
var UserAccount = db.import('../models/UserAccount.js');

var RecipeIngredients = db.import('../models/RecipeIngredients.js');
var UserRecipeInstructions = db.import('../models/UserRecipeInstructions.js');

let keysAvailable = [];
keysAvailable.push(keys.key);
keysAvailable.push(keys.key2);
let keyInUse = 0;
/* Gets a list of recipes matching criteria
format to come from APP : http://localhost:8082/recipe/search?id=123&cuisine=italian&title=pizza
*/
exports.getRecipes = async function (req, res) {
  console.log('KEY %%%% : ')
  console.log(apiKey);
  var flag = true;
  let searchBoth = true;
  let response = "";
  var query = "";
  var dbQuery = {};
  var bodyParams = req.body;
  console.log(req.query);
  //check if user flag is true
  if (bodyParams.user) {
    flag = true;
    searchBoth = false;
  }
  if (flag) {


    for (var key in req.query) {
      if (key == "user") {
        flag = true;
        searchBoth = false;
        continue;
      }
      if (query) {
        query = query + "&" + key + "=" + req.query[key];


      }
      else
        query = query + key + "=" + req.query[key];

      dbQuery[key] =
        {
          [Op.like]: '%' + (req.query[key]) + '%'
        }
    }
  }

  console.log('DB ======= ');
  console.log(dbQuery.key);
  if (flag) { //&& searchBoth) {
    //Builing Query for spoonacular
    var encodedQueryString = encodeURIComponent(req.body.query);
    var searchQuery = "query=" + encodedQueryString + '&cuisine=' + req.body.cuisine + '&type=' + req.body.mealType;
    if (req.body.includeIngredients.length > 0) {
      searchQuery = searchQuery + '&includeIngredients=';
      //  var ingredients = JSON.parse(req.body);
      for (var i = 0; i < req.body.includeIngredients.length; i++) {
        searchQuery = searchQuery + req.body.includeIngredients[i] + ',';
      }
    }

    let usingKey = keysAvailable[keyInUse];

    let runAgain = true;
    while (runAgain) {
      try {
        let result;
        usingKey = keysAvailable[keyInUse];
        var reqURL = urlBase + 'complexSearch?apiKey=' + usingKey + '&number=' + resultLimit + '&' + 'addRecipeInformation=true&instructionsRequired=true&' + searchQuery;
        console.log('Spoonacular Query: ' + reqURL);
        await axios.get(reqURL).then(recipes => {
          // let recipeObj = JSON.parse(recipes.data.results);
          runAgain = false;
          recipes.data.results.forEach(recipe => {
            let details = new RecipeDetails(recipe.id, false, recipe.sourceName, recipe.title, recipe.summary, recipe.servings, recipe.readyInMinutes, recipe.image, "", (recipe.cuisines) ? recipe.cuisines[0] : "", (recipe.dishTypes) ? recipe.dishTypes[0] : "", false, "");
            recipeResults.push(details);
            console.log(details);
            console.log("*****************");
          });


          //result = JSON.stringify(recipeResults);
          // response = result;

        });
        // response = result;
      } catch (error) {
        console.error(error);
        if (keyInUse < 2)
          keyInUse++;
      }
    }
    console.log('API RESULTS ========');

    // res.send(response);
  }
  if (flag) {
    console.log(req.body.query);
    const ingredientSearchResults = [];
    let recipesWithIngredients = [];
    let foundRecipesWithId = [];
    try {
      if (req.body.includeIngredients.length > 0) {
        for (var i = 0; i < req.body.includeIngredients.length; i++) {
          let searchIngredient = req.body.includeIngredients[i];
          const { count, rows } = await RecipeIngredients.findAndCountAll(
            {
              where: {
                [Op.and]: {

                  ingredientName: {
                    [Op.like]: '%' + searchIngredient + '%',
                  },

                },

              },
              raw: true
            }

          );
          console.log(rows);
          rows.forEach(row => {
            ingredientSearchResults.push(row);
          })

        };

        console.log(ingredientSearchResults);

        let commonIngredients = [];
        var matchCount = 0;
        for (var i = 0; i < ingredientSearchResults.length; i++) {
          for (var j = 0; j < ingredientSearchResults.length; j++) {

            if (ingredientSearchResults[j].recipeUid == ingredientSearchResults[i].recipeUid)
              matchCount++;

          }
          if (matchCount == req.body.includeIngredients.length) {
            commonIngredients.push(ingredientSearchResults[i]);
          }
          matchCount = 0;
          flag = false;
          if (commonIngredients.length > 0) {
            for (var x = 0; x < recipesWithIngredients.length; x++) {
              if (recipesWithIngredients[x] == commonIngredients[0].recipeUid) {
                flag = true;
              }
            }
            if (!flag)
              recipesWithIngredients.push(commonIngredients[0].recipeUid);
            commonIngredients = [];
          }
        }

        console.log(recipesWithIngredients);
        if (recipesWithIngredients.length > 0) {
          for (var id = 0; id < recipesWithIngredients.length; id++) {
            var index = recipesWithIngredients[id]
            console.log(index);
            await getUserRecipe(index).then(recipe => {
              /*
              let recipe = UserRecipes.findOne({
                where: {
                  uid: i.recipeUid
                },
                raw: true
              });
              */
              if (recipe && recipe.isPublished) {
                console.log("found recipe", recipe);
                let detail = new RecipeDetails(recipe.uid, true, recipe.sourceName, recipe.recipeTitle, recipe.summary, recipe.servings, recipe.readyInMinutes, recipe.recipeImage, "", recipe.cuisine, recipe.mealType, recipe.isPublished, recipe.userId);
                console.log("USER RESULT:: " + detail);

                foundRecipesWithId.push(detail);
              }
            });



            console.log('iterator');
          };
        }


        var search = {};
        if (req.body.cuisine)
          search.cuisine = { [Op.like]: '%' + req.body.cuisine + '%' };

        if (req.body.mealType)
          search.mealType = { [Op.like]: '%' + req.body.mealType + '%' };
        var targetRecipeUids = recipesWithIngredients;
        const { count, rows } = await UserRecipes.findAndCountAll(
          {
            where: {
              uid: {
                [Op.in]: targetRecipeUids
              },
              [Op.or]: {
                recipeTitle: {
                  [Op.like]: '%' + req.body.query + '%',
                },
                summary: {
                  [Op.like]: '%' + req.body.query + '%',
                }
              },
              [Op.and]: [search]

            },
            raw: true
          }

        );
        // const result = JSON.stringify(rows);
        rows.forEach(recipe => {
          let detail = new RecipeDetails(recipe.uid, true, recipe.sourceName, recipe.recipeTitle, recipe.summary, recipe.servings, recipe.readyInMinutes, recipe.recipeImage, "", recipe.cuisine, recipe.mealType, recipe.isPublished, recipe.userId);
          console.log("USER RESULT:: " + detail);
          recipeResults.push(detail);

        });

        //  response = result;
        res.send(recipeResults);
        recipeResults = [];
      }
      //The Loop For not seraching/filtering with ingredients
      else {
        var search = {};
        if (req.body.cuisine)
          search.cuisine = { [Op.like]: '%' + req.body.cuisine + '%' };

        if (req.body.mealType)
          search.mealType = { [Op.like]: '%' + req.body.mealType + '%' };

        const { count, rows } = await UserRecipes.findAndCountAll(
          {
            where: {
              [Op.or]: {
                recipeTitle: {
                  [Op.like]: '%' + req.body.query + '%',
                },
                summary: {
                  [Op.like]: '%' + req.body.query + '%',
                }
              },
              [Op.and]: [search]

            },
            raw: true
          }

        );

        //  const result = JSON.stringify(rows);
        rows.forEach(recipe => {
          if (recipe.isPublished) {
            let detail = new RecipeDetails(recipe.uid, true, recipe.sourceName, recipe.recipeTitle, recipe.summary, recipe.servings, recipe.readyInMinutes, recipe.recipeImage, "", recipe.cuisine, recipe.mealType, recipe.isPublished, recipe.userId);
            console.log("USER RESULT:: " + detail);
            recipeResults.push(detail);
          }
        });

        //  response = result;

        res.send(recipeResults);
        recipeResults = [];
      }
    } catch (err) {

      console.log(err);
    } finally {
      //  res.send(recipeResults);
    }


  }
}

// Display detail page for a specific Author.
exports.recipeDetail = async function (req, res) {
  var response;
  // console.log('Sending API Request to : '+ urlBase+req.params.id+'/information');
  var id = "";
  id = id + req.body.id;
  if (id.charAt(0) != 'U') {
    let usingKey = keysAvailable[keyInUse];

    let runAgain = true;
    while (runAgain) {
      try {
        usingKey = keysAvailable[keyInUse];
        recipe = await axios.get(urlBase + id + '/information?apiKey=' + usingKey);
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
        runAgain = false;
        res.send(recipeDetail);
      } catch (error) {
        console.error(error);
        if (keyInUse < 2)
          keyInUse++;
      }
    }
  }
  else
    if (id.charAt(0) == 'U') {
      let recipe = await getUserRecipe(id);
      const ingredients = await RecipeIngredients.findAll({
        where: {
          recipeUid: id
        },

      });

      let recipeDetail = new RecipeDetails(recipe.uid, true, recipe.sourceName, recipe.recipeTitle, recipe.summary, recipe.servings, recipe.readyInMinutes, recipe.recipeImage, "", recipe.cuisine, recipe.mealType, recipe.isPublished, recipe.userId);
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
      res.send(recipeDetail);

    };


};



exports.userRecipeDetail = async function (req, res) {
  var response;
  // console.log('Sending API Request to : '+ urlBase+req.params.id+'/information');
  var id = "";
  id = id + req.body.uid;
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
      res.send(recipeDetail);

    };


};

async function getUserRecipe(uid) {
  let recipe = UserRecipes.findOne({
    where: {
      uid: uid
    },
    raw: true
  });
  return recipe;
}

exports.getUserRecipeByUserId = async function getUserRecipeByUserId(req, res) {
  let recipe = await UserRecipes.findOne({
    where: {
      uid: req.body.uid,
      userId: req.body.userId //req.body.userId
    },
    raw: true
  });

  res.send(recipe);
}
exports.getAllUserRecipeByUserId = async function getAllUserRecipeByUserId(req, res) {
  let recipes = await UserRecipes.findAll({
    where: {

      userId: req.body.userId
    },
    raw: true
  });

  res.send(recipes);
}

// Handle Author create on POST.
exports.recipeCreatePOST = async function (req, res) {
  console.log('Creating New RECIPE \n');
  let data = req.body;
  console.log(data);
  let isPosted = false;
  let newUserRecipe;
  /*
    IngredientsCategory.create(data).then(() => {
      res.send('DONE')
    }).catch((err) => {
      res.send(err);
      console.log(err);
    });
  */
  await UserRecipes.create(data).then(async tableData => {
    newUserRecipe = tableData
    newUserRecipe.uid = "U" + newUserRecipe.id;
    await newUserRecipe.save().then(async () => {

      isPosted = true;
      console.log("Final User Recipe");

      console.log(newUserRecipe);
      if (data.ingredients.length > 0) {
        for (var i = 0; i < data.ingredients.length; i++) {
          let sendData = {
            "recipeId": newUserRecipe.id,
            "recipeUid": newUserRecipe.uid,
            "ingredientName": data.ingredients[i].name,
            "quantityUsed": data.ingredients[i].quantity,
            "unitOfMeasure": data.ingredients[i].unit

          }
          console.log("Sending Data to DB", sendData);
          await RecipeIngredients.create(sendData);

        }
      }

      if (data.steps) {
        for (var i = 0; i < data.steps.length; i++) {
          let sendData = {
            "recipeId": newUserRecipe.id,
            "uid": newUserRecipe.uid,
            "userId": newUserRecipe.userId,
            "description": data.steps[i],
            "specialInfo": "",

          }
          await UserRecipeInstructions.create(sendData);

        }
      }
    });

    /*
    const user = await UserAccount.findOne(data, {
      where: {
        uid: {
          [Op.eq]: userId
        }
      }
    });
    const toUpdateData = { recipeIds: user.recipeIds + "," + newUserRecipe.uid }
    const userId = newUserRecipe.userId;
    await UserAccount.update(data, {
      where: {
        uid: {
          [Op.eq]: userId
        }
      }
     
  })
 */
    res.send('Successful Create' + data);


  }).catch((err) => {
    res.send("There was an error saving your recipe." + err);
    console.log(err);
  });


  console.log('Posted');


}
async function getRecipeDetails(recipeId) {
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
      return recipeDetail;
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

exports.recipeAddToUserPOST = async function (req, res) {
  console.log('Adding RECIPE \n');
  let data = req.body;
  //let tempRecipe = await getRecipeDetails(data.id);
  // console.log(tempRecipe);
  // res.send();
  let recipeTitle = data.title;
  let userId = req.body.userId;
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
    })

    res.send('Successful Create' + data);


  }).catch((err) => {
    res.send("There was an error saving your recipe." + err);
    console.log(err);
  });

  console.log('Posted');


}

exports.recipeUpdatePOST = async function (req, res) {
  console.log('UPDATIG RECIPE \n');
  let data = req.body;
  let isPosted = false;
  let uid = req.body.uid;

  console.log(data);
  await UserRecipes.update(data, {
    returning: true,
    where: {
      uid: {
        [Op.eq]: uid
      }

    },

  }).then(async () => {

    isPosted = true;
    console.log("Final User Recipe");
    let recipeId = uid.substring(1);
    // console.log(result);
    if (data.ingredients.length > 0) {
      const ingredients = await RecipeIngredients.destroy({
        where: {
          recipeUid: uid
        },

      });



      for (var i = 0; i < data.ingredients.length; i++) {
        let sendData = {
          "recipeId": recipeId,
          "recipeUid": uid,
          "ingredientName": data.ingredients[i].name,
          "quantityUsed": data.ingredients[i].amount,
          "unitOfMeasure": data.ingredients[i].unit

        }
        console.log("Sending Data to DB", sendData);
        await RecipeIngredients.create(sendData);

      }
    }

    if (data.steps) {
      const ingredients = await UserRecipeInstructions.destroy({
        where: {
          uid: uid
        },

      });

      for (var i = 0; i < data.steps.length; i++) {
        let sendData = {
          "recipeId": recipeId,
          "uid": uid,
          "userId": data.userId,
          "description": data.steps[i],
          "specialInfo": "",

        }
        await UserRecipeInstructions.create(sendData);

      }
    }
    res.send('Success');
  }).catch(function (err) {
    console.log(err);
    isPosted = false;
  });




}

// Display Author delete form on GET.
exports.recipeDelete = async function (req, res) {
  let uid = req.body.uid;
  await UserRecipes.destroy({
    where: {
      uid: uid
    }
  });
  await UserRecipeInstructions.destroy({
    where: {
      uid: uid
    }
  })
  await RecipeIngredients.destroy({
    where: {
      recipeUID: uid
    }
  })

  res.send('Success');
};


// Handle Author update on POST.
exports.recipeTest = async function (req, res) {
  console.log('TEST RECIPE \n');
  let data = req.body;
  let isPosted = false
  /*
    IngredientsCategory.create(data).then(() => {
      res.send('DONE')
    }).catch((err) => {
      res.send(err);
      console.log(err);
    });
  */
  console.log(data);

  UserRecipes.findAll({
    where: req.body,
    include: [{
      model: RecipeIngredients,
      where: { recipedId: 2 }
    }]
  }).then(data => {
    console.log(data);
  });
}