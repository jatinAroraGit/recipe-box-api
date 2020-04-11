var express = require("express");
var app = express();
var path = require("path");
const admin = require('firebase-admin');
const apiSecret = require('../../config/apiKey.json');
const routes = require("./routes.js");
const checkUser = require("./authentication");
var recipeRouter = require('./recipe');
var userAccountRouter = require('./account');
var cookbookRouter = require('./Jcookbook');
var shoppingListRouter = require('./JshoppingList');
const crypto = require('crypto');
const serviceAccount = require('../../config/firebaseServiceKey.json');

//const admin = require('./src/firebase-admin/admin');
const dataService = require('.//routes');
var express = require('express');
var router = express.Router();
var cypherKey = "secrets";

var cookieParser = require('cookie-parser');
var HTTP_PORT = process.env.PORT || 8082;

process.env.SECRET = apiSecret.key;


router.use(express.static(__dirname));

router.use(function (req, res, next) {  // Enable cross origin resource sharing (for app frontend)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // Prevents CORS preflight request (for PUT game_guess) from redirecting
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next(); // Passes control to next (Swagger) handler
  }
});
router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));

});

router.get("/about", function (req, res) {
  res.send({ 'Page': 'About' });
});

//router.use('/recipe', recipeRouter);
router.use('/userAccount', userAccountRouter);

router.use("/recipes", recipeRouter);
router.use("/cookbooks", cookbookRouter);
router.use("/shoppingList", shoppingListRouter);

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

router.get("/sendEmail/:email", function (req, res) {
  const nodemailer = require("nodemailer");
  let encrypted = encrypt(req.params.email);
  console.log(encrypted);
  let decrypted = decrypt(encrypted);
  console.log(decrypted);
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'prj666_201a04@myseneca.ca', // generated ethereal user
        pass: 'NJ34h^5!p8v5' // generated ethereal password
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"RecipeBox" <prj666_201a04@myseneca.ca>', // sender address
      to: "jaarora45@gmail.com", // list of receivers
      subject: "Hello ", // Subject line
      text: "Hello world", // plain text body
      html: "<b>Hey there,</b><p>Please Use The Link Below To Reset Your Password</p><a href='http://192.168.0.14:5000/rest-api/reset/" + encrypted + "'>Reset Password</a><p>Your Recipe Box Team</p>" // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  main().catch(console.error);
});


router.get("/reset/:email", function (req, res) {

  let decrypted = decrypt(req.params.email);
  console.log(decrypted);
  res.sendFile(path.join(__dirname, "../resetPass.html"));

});

router.get("/resetPassword/:userEmail/:userPassword", async function (req, res) {
  admin.auth().getUserByEmail(req.params.userEmail).then(async (data) => {
    console.log('FB Success');
    console.log(data);
    let uid = data.uid;
    await admin.auth().updateUser(uid, { password: req.params.userPassword }).catch((err) => {
      console.log(err);
    });
    res.send('Success');
  }).catch((err) => {
    console.log(err);
  });
});


function encrypt(text) {
  var cipher = crypto.createCipher('aes-256-cbc', cypherKey)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted; //94grt976c099df25794bf9ccb85bea72
}
function decrypt(text) {
  var decipher = crypto.createDecipher('aes-256-cbc', cypherKey)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec; //myPlainText
}
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