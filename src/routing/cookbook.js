var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var recipeController = require('../controllers/recipeController');
var cookbookController = require('../controllers/cookbookController');

// Routes for cookbook
router.get('/cookbook', function (req, res) {
  res.send({ "router": "cookbook" }); 
});

router.post('/createCookbook', cookbookController.cookbookCreatePOST);
router.post('/updateCookbook', cookbookController.cookbookUpdatePOST);
router.post('/addRecipeToCookbook', cookbookController.addRecipeToCookbookPOST);
router.post('/removeRecipeFromCookbook', cookbookController.removeRecipeFromCookbookPOST);
router.post('/deleteCookbook', cookbookController.cookbookDeletePOST);

router.post('/test', cookbookController.cookbookTest);

module.exports = router;