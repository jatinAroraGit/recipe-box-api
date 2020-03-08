var axios = require('axios');
const apiKey = process.env.secret;
const keys = require('../../config/apiKey.json')

const { Sequelize, Model, DataTypes, Op } = require("sequelize");
/* Important steps to connect to db instance and update it */

var db = new Sequelize('prj666_201a04', dbUsername, dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

var UserAccount = db.import('../models/UserAccount.js');

exports.securityQuestionCreatePOST = function (req, res) {
  console.log('CREATING USER \n');
  const data = req.body;

  UserAccount.create(data).then(() => {
    res.send('DONE')
  }).catch((err) => {
    res.send(err);
    console.log(err);

    console.log('Created');
  });
};