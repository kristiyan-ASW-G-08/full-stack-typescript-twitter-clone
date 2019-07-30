import db from 'src/db';
import app from 'src/app';

db();
const port = process.env.PORT || 8080;
const server = app.listen(port);
export default server;
