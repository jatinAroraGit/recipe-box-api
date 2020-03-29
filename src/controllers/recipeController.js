//var Recipe = require('../models/Recipe');
// Display list of all Authors.
var axios = require('axios');
const urlBase = "https://api.spoonacular.com/recipes/"
const apiKey = process.env.secret;
const keys = require('../../config/apiKey.json')
var rr = require('../routing/routes')
//const recipeModel = require("../models/UserRecipes");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
/* Important steps to connect to db instance and update it */

var db = new Sequelize(keys.dbUsername, keys.dbUsername, keys.dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});
const resultLimit = 20; // limit of spoonacular api results; 
var UserRecipes = db.import('../models/UserRecipes.js');
var RecipeIngredients = db.import('../models/RecipeIngredients.js');

/* Gets a list of recipes matching criteria
format to come from APP : http://localhost:8082/recipe/search?id=123&cuisine=italian&title=pizza
*/
exports.getRecipes = async function (req, res) {
  console.log('KEY %%%% : ')
  console.log(apiKey);
  var flag = false;
  let searchBoth = true;
  let response = ""
  var query = "";
  var dbQuery = {};
  var bodyParams = req.body;
  console.log(req.query);
  //check if user flag is true
  if (bodyParams.user) {
    flag = true;
    searchBoth = false;
  }
  if (!user) {


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
  if (!flag && searchBoth) {
    var reqURL = urlBase + 'complexSearch?apiKey=' + process.env.secret + '&number=' + resultLimit + '&' + query;
    try {
      let result = await axios.get(reqURL);
      response = result;
    } catch (error) {
      console.error(error);
    }
    console.log('API RESULTS ========');

    res.send(response.data);
  }
  if (flag) {
    try {
      const { count, rows } = await UserRecipes.findAndCountAll(
        {
          where: bodyParams,
          raw: true
        }

      );

      const result = JSON.stringify(rows);
      console.log("RESULTS:: " + result);
      response = result;
      console.log(response);
    } catch (err) {
      console.log(err.lineNumber);
      console.log(err);
    }

    res.send(response);
  }
}

// Display detail page for a specific Author.
exports.recipeDetail = async function (req, res) {
  var response;
  // console.log('Sending API Request to : '+ urlBase+req.params.id+'/information');
  try {
    response = await axios.get(urlBase + req.params.id + '/information?apiKey=' + process.env.secret);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
  res.send(response.data);
  /*
 console.log('Sending API Request to : '+ urlBase+req.params.id+'/information');
 fetch(urlBase+req.params.id+'/information?apiKey='+apiKey)
 .then((response) => {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    return response.json();
 })
 .then((data) => {
     var x = data;
 })
 .catch((error) => console.error(error));;
   res.send(x);
   */
};

// Display Author create form on GET.
exports.recipeCreateGET = function (req, res) {
  res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.recipeCreatePOST = async function (req, res) {
  console.log('POSTING RECIPE \n');
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
  await UserRecipes.create(data).then(async tableData => {
    let userRecipe = tableData
    userRecipe.uid = "U" + userRecipe.id;
    await userRecipe.save();

    isPosted = true;

    console.log(userRecipe)

    res.send('Successful Create' + JSON.stringify(data))


  }).catch((err) => {
    res.send("There was an error saving your recipe." + err);
    console.log(err);
  });


  /*
  .then(() => {
    isPosted = true;

    res.send('Success' + data)


  }).catch((err) => {
    res.send("There was an error saving your recipe." + err);
    console.log(err);
  });
  ********/


  console.log('Posted');


}

exports.recipeUpdatePOST = async function (req, res) {
  console.log('UPDATIG RECIPE \n');
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
  await UserRecipes.update(data, { where: { id: 30 } }).then(async tableData => {
    const userRecipe = tableData;
    // await userRecipe.save();
    isPosted = true;
    console.log(userRecipe)

    res.send('Success' + JSON.stringify(data))


  }).catch((err) => {
    res.send("There was an error updating your recipe." + err);
    console.log(err);
  });
  //await userRecipe.save();

  /*
  .then(() => {
    isPosted = true;

    res.send('Success' + data)


  }).catch((err) => {
    res.send("There was an error saving your recipe." + err);
    console.log(err);
  });
  ********/


  console.log('Updated');


}

// Display Author delete form on GET.
exports.recipeDeleteGET = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.recipeDeletePOST = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.recipeUpdateGET = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
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
      where: {recipedId: 2}
     }]
  }).then(data => {
    console.log(data);
  });
}