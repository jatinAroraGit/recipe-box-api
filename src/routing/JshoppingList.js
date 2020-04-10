var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var shoppingListController = require('../controllers/JshoppingListController');

// Routes for recipes
router.get('/', function (req, res) {
  res.send({ "router": "shoppingList" }); 4
});


router.post('/createShoppingList', shoppingListController.createShoppingList);
router.post('/updateShoppingList', shoppingListController.updateShoppingList);
router.post('/getShoppingList', shoppingListController.getShoppingList);
router.post('/updateShoppingListOneItem', shoppingListController.updateShoppingListOneItem);
router.post('/deleteShoppingListItem', shoppingListController.deleteShoppingListItem)


module.exports = router;