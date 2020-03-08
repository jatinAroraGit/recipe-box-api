var express = require("express");
var app = express();
var path = require("path");
const admin = require('firebase-admin');
const apiSecret = require('../../config/apiKey.json');
const routes = require("./routes.js");
const checkUser = require("./authentication");
var recipeRouter = require('./recipe');
//const admin = require('./src/firebase-admin/admin');
const dataService = require('.//routes');
var express = require('express');
var router = express.Router();

var cookieParser = require('cookie-parser');
var HTTP_PORT = process.env.PORT || 8082;

process.env.SECRET = apiSecret.key;


router.use(express.static(__dirname));
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));

});

router.get("/about", function (req, res) {
  res.send({ 'Page': 'About' });
});

router.use('/recipe', recipeRouter);

router.get("/recipe/:recipeId", function (req, res) {
  res.send(req.params);

});
router.get("/authenticate/:id", verifyUser, function (req, res) {
  res.json({
    message: 'Authenticated!'
  })
});
router.get("/updateUserQuestion?", verifyUser, function (req, res) {
  res.json({
    message: 'Authenticated!'
  })
});

function verifyUser(req, res, next) {
  var idToken = req.query.id;
  console.log('VERIFYING ******* ');
  admin.auth().verifyIdToken(idToken)
    .then(function (decodedToken) {
      let uid = decodedToken.uid;

    }).catch(function (error) {

    });
}

router.use(function (req, res) {
  res.status(404).send("Page Not Found.");
});

module.exports = router;
/*
dataService.initialize()
  .then(() => {
    router.listen(HTTP_PORT, app.listen);
  }).catch((err) => {
    console.log("Not able to connect to the server");
  });
  */