import https from 'https';
import fs from 'fs';
import connectToDB from '@utilities/connectToDB';
import app from 'src/app';

const initServer = (): void => {
  // const httpsApp = https.createServer(
  //   {
  //     key: fs.readFileSync('server.key'),
  //     cert: fs.readFileSync('server.cert'),
  //   },
  //   app,
  // );
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  connectToDB(mongoURI);
  const port = process.env.PORT || 8080;
  app.listen(port);
};

initServer();

export default initServer;
