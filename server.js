var express = require("express");
var app = express();
var path = require("path");
const admin = require('firebase-admin');
const apiSecret = require('./config/apiKey.json');
const apiRouter = require('./src/routing/api');
//const admin = require('./src/firebase-admin/admin');
const dataService = require('./src/routing/routes');

var cookieParser = require('cookie-parser');
var HTTP_PORT = process.env.PORT || 8082;
// VM Options
const vmHostname = '10.102.112.128';
const vmPort = 10034;
/*************DO NOT TOUCH ************************************ */
app.use(express.static(__dirname));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  console.log('PATH: ', path);
  res.sendFile(path.join(__dirname, "src/home.html"));
});



app.get('/android', function (req, res) {
  var filePath = '../appBuilds/android/recipeBox.apk'; // Or format the path using the `id` rest param
  var fileName = "recipeBox.apk"; // The default name the browser will use
  try {
    res.download(filePath, fileName);
  } catch (err) {
    res.send('File Not Found. Android app build is not available');
  }
});

app.get('/ios', function (req, res) {
  var filePath = '../appBuilds/ios/recipeBox.ipa'; // Or format the path using the `id` rest param
  var fileName = "recipeBox.ipa"; // The default name the browser will use
  try {
    res.download(filePath, fileName);
  } catch (err) {
    res.send('File Not Found. iOS app builds are not available yet');
  }
});
/*****************************************************************/
app.use("/rest-api", apiRouter);

app.get("/docs", function (req, res) {
  res.sendFile(path.join(__dirname, "/src/index.html"));
});

// setup another route to listen on /about
dataService.initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart());
  }).catch((err) => {
    console.log(err);
  });
onHttpStart = () => {
  console.log("Express http server listening on: " + HTTP_PORT);
}
/* Code for VM startup
app.listen(vmPort, vmHostname, () => {
  console.log('Server is running at http://' + vmHostname + ':' + vmPort + '/');
});
*/