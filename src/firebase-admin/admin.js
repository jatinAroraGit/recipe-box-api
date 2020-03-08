const admin = require('firebase-admin');
var adminAccount = require("../../config/firebaseKey.json");
admin.initializeApp({
  credential: admin.credential.cert(adminAccount),
});

module.exports = admin;