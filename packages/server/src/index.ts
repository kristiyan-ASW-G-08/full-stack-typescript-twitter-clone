import db from 'src/db';
import app from 'src/app';
import rateLimiter from '@customMiddleware/rateLimiter';

db();
const port = process.env.PORT || 8090;
app.use(rateLimiter);
const server = app.listen(port);
export default server;
