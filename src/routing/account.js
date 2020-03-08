var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var userAccountController = require('../controllers/userAccountController.js');

// Routes for recipes
router.get('/', function (req, res) {
    res.send({ "router": "account" }); 
});

router.post('/createSecurityQuestion', userAccountController.securityQuestionCreatePOST);

module.exports = router;