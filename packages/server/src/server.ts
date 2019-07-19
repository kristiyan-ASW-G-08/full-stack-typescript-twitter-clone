import app from "./app";
import db from "./db";
db();
const port = process.env.PORT || 8080;
const server = app.listen(port);
export default server;
