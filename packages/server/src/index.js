"use strict";
exports.__esModule = true;
var connectToDB_1 = require("@utilities/connectToDB");
var app_1 = require("src/app");
var initServer = function () {
    // const httpsApp = https.createServer(
    //   {
    //     key: fs.readFileSync('server.key'),
    //     cert: fs.readFileSync('server.cert'),
    //   },
    //   app,
    // );
    var _a = process.env, MONGO_USER = _a.MONGO_USER, MONGO_PASSWORD = _a.MONGO_PASSWORD, MONGO_DATABASE = _a.MONGO_DATABASE;
    var mongoURI = "mongodb+srv://" + MONGO_USER + ":" + MONGO_PASSWORD + "@cluster0.ol9wi.mongodb.net/" + MONGO_DATABASE + "?retryWrites=true";
    connectToDB_1["default"](mongoURI);
    var port = process.env.PORT || 8080;
    app_1["default"].listen(port);
};
initServer();
exports["default"] = initServer;
