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
router.post('/detail', recipeController.recipeDetail); // request a recipe detail by ID
router.post('/search', recipeController.getRecipes);
router.post('/searchx', recipeController.getRecipes); // search for recipes
//router.get('/create', recipeController.recipeCreateGET); // POST Create Recipe
//router.post('/getUserRecipeByUserId', recipeController.getUserRecipeByUserId);
router.post('/getUserRecipeByUserId', recipeController.userRecipeDetail);


router.post('/createRecipe', recipeController.recipeCreatePOST);
router.post('/updateRecipe', recipeController.recipeUpdatePOST);
router.post('/addRecipe', recipeController.recipeAddToUserPOST);
router.post('/deleteRecipe', recipeController.recipeDelete);
router.post('/allUserRecipes', recipeController.getAllUserRecipeByUserId);

router.post('/test', recipeController.recipeTest);


module.exports = router;