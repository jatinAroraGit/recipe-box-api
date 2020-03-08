var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var recipeController = require('../controllers/recipeController');

// Routes for recipes
router.get('/', function (req, res) {
  res.send({ "router": "recipe" }); 4
});
router.get('/detail/:id', recipeController.recipeDetail); // request a recipe detail by ID
router.get('/search?*', recipeController.getRecipes); // search for recipes
router.get('/create', recipeController.recipeCreateGET); // POST Create Recipe
router.post('/createRecipe', recipeController.recipeCreatePOST);
router.post('/updateRecipe', recipeController.recipeUpdatePOST);
router.post('/example', (req, res) => {
  console.log("req.body :: ");
  console.log(req.body);
});

module.exports = router;