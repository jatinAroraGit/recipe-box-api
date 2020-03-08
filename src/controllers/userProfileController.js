var axios = require('axios');

const { Sequelize, Model, DataTypes, Op } = require("sequelize");
/* Important steps to connect to db instance and update it */

var db = new Sequelize('prj666_201a04', dbUsername, dbPass, {
  host: 'mymysql.senecacollege.ca',
  dialect: 'mysql',
  define: {
    timestamps: false
  }
});

var UserProfile = db.import('../models/UserProfiles.js');

exports.userCreatePOST = function (req, res) {
  console.log('CREATING USER \n');
  const data = req.body;

  UserProfile.create(data).then(() => {
    res.send('DONE')
  }).catch((err) => {
    res.send(err);
    console.log(err);

    console.log('Created');
  });
};

module.exports.addUser = (userData) => {

  return new Promise(function (resolve, reject) {

    for (var foo in userData) {
      if (userData[foo] == "") {
        userData[foo] = null;
      }
    }
    UserProfile.create({
      lastName: UserProfile.lastName,
      firstName: UserProfile.firstName,
      diet: UserProfile.diet
    }).then(function (data) {
      resolve(data);
    })
      .catch(function (err) {
        reject("Error! Unable to create User");
      })
  });
};

module.exports.updateUser = (userData) => {

  return new Promise(function (resolve, reject) {

    for (var bar in userData) {
      if (userData[bar] == "") {
        userData[bar] = null;
      }
    }

    UserProfile.update({
      lastName: UserProfile.lastName,
      firstName: UserProfile.firstName,
      diet: UserProfile.diet
    },
      {
        where: { userProfileId: userData.userProfileId }
      }).then(function (data) {
        resolve(data);
      })
      .catch((err) => {
        reject("Error! Unable to update User");
      });
  });
};

module.exports.deleteUserById = function (userId) {

  return new Promise(function (resolve, reject) {

    UserProfile.destroy({
      where: { userProfileId: userId }
    })
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Error! User was not deleted");
      })
  })
}

module.exports.getUserProfileById = (userId) => {

  return new Promise((resolve, reject) => {

    UserProfile.findAll({
      where: { userProfileId: userId }
    })
      .then((data) => {
        resolve(data[0]);
      })
      .catch(() => {
        reject("Error! No User returned for this profileId");
      })

  });
};

module.exports.getAllUsers = () => {

  return new Promise(function (resolve, reject) {
    UserProfile.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("Error! No User returned");
      });
  });
}