import db from './db';
import app from './app';

db();
const port = process.env.PORT || 8080;
const server = app.listen(port);
export default server;
