"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connectToDB_1 = __importDefault(require("@utilities/connectToDB"));
const app_1 = __importDefault(require("src/app"));
const initServer = () => {
    // const httpsApp = https.createServer(
    //   {
    //     key: fs.readFileSync('server.key'),
    //     cert: fs.readFileSync('server.cert'),
    //   },
    //   app,
    // );
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    connectToDB_1.default(mongoURI);
    const port = process.env.PORT || 8080;
    app_1.default.listen(port);
};
initServer();
exports.default = initServer;
