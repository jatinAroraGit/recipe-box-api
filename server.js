var express = require("express");
var app = express();
var cors = require("cors");
var path = require("path");

//var ip = require('internal-ip');
const admin = require('firebase-admin');
const serviceAccount = require('./config/firebaseServiceKey.json');
const apiSecret = require('./config/apiKey.json');
const apiRouter = require('./src/routing/api');
//const admin = require('./src/firebase-admin/admin');
const dataService = require('./src/routing/routes');
const https = require('https');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var HTTP_PORT = process.env.PORT || 5000;
// VM Options
const vmHostname = '10.102.112.128';
const vmPort = 10034;

/*************DO NOT TOUCH ************************************ */
app.use(cors());
app.use(express.static(__dirname));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
  console.log('PATH: ', path);
  res.sendFile(path.join(__dirname, "src/home.html"));
});
console.log("System:: " + process.platform);
if (process.platform == "win32") {

  //  console.log(getInternalIp.v4());
  //const ipAdress = JSON.stringify(v4Info);
  //const idr = ipAdress["Wi-Fi"];
  // console.log(idr);
  //console.log(ipAdress);
  //console.log(ipAdress);

  app.listen(HTTP_PORT, '192.168.0.14', () => {
    // app.listen(80, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || '127.0.0.1', () => {
    console.log("Server Running Locally On IP http://" + '192.168.0.14' + ":" + HTTP_PORT + "/");
    /*
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    }, 'RecipeBoxAPI').auth().getUserByEmail('jarora4@myseneca.ca').then(data => {
      console.log('FB Success');
      console.log(data);
      let uid = data.uid;
      admin.auth().updateUser(uid, { password: '123456!Qw' });

    });
*/
    dataService.initialize()
      .then(() => {
        console.log('DATABASE CONNECTED SUCCESSFULLY');
      }).catch((err) => {
        console.log(err);
      });
  });

  /* // Local Https Server Code 
  https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: "recipebox"
  }, app)
    .listen(HTTP_PORT, localIp, function () {
      console.log('Example app listening on port ' + HTTP_PORT + '  Go to  https://' + localIp + ':3000/');
      dataService.initialize()
        .then(() => {
          console.log('DATABASE CONNECTED SUCCESSFULLY');
        }).catch((err) => {
          console.log(err);
        });
    })
    */
}
else {
  https.createServer({
    key: fs.readFileSync('cert/prj666-2021.key'),
    cert: fs.readFileSync('cert/prj666-2021.crt'),
    ca: fs.readFileSync('cert/RapidSSL_RSA_CA_2018.crt')
  }, app)
    .listen(vmPort, vmHostname, function () {
      console.log('Example app listening on port 6759 Go to Recipe Box Website');
      dataService.initialize()
        .then(() => {
          console.log('DATABASE CONNECTED SUCCESSFULLY');
        }).catch((err) => {
          console.log(err);
        });
    })
}

app.get('/android', function (req, res) {
  var filePath = '../appBuilds/android/recipeBox.apk'; // Or format the path using the `id` rest param
  var fileName = "recipeBox.apk"; // The default name the browser will use
  try {
    res.download(filePath, fileName);
  } catch (err) {
    res.send('File Not Found. Android app build is not available');
  }
});
app.post('/test', function (req, res) {
  res.send({ "TestCall": "Success" });
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


/* Code for VM startup
app.listen(vmPort, vmHostname, () => {
  console.log('Server is running at http://' + vmHostname + ':' + vmPort + '/');
});
*/
