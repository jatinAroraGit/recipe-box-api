var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var userAccountController = require('../controllers/userAccountController.js');

// Routes for recipes
router.get('/', function (req, res) {
  res.send({ "router": "userAccount" });
});

router.post('/createUserAccount', userAccountController.userAccountCreatePOST);
router.post('/getUserAccount', userAccountController.getUserAccountById);
router.post('/delete', userAccountController.userAccountDeletePOST);
module.exports = router;