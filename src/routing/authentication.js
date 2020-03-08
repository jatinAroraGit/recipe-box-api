const admin = require('firebase-admin');
const adminJs = require('../firebase-admin/admin');
module.exports = function () {
  admin.auth().getUserByEmail('test@test.com')
    .then(function (userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully fetched user data:', userRecord.toJSON());
    })
    .catch(function (error) {
      console.log('Error fetching user data:', error);
    });
}