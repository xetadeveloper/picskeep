// Modules
import './config.js';
import express from 'express';
import {
  checkIfConnected,
  closeClientInstance,
  getDBInstance,
} from './Database/mongoDB.js';
import path from 'path';
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';
import { serverErrorFound } from './Utils/errorHandling.js';
import { v4 as genUUID } from 'uuid';
import { isLoggedIn } from './Middleware/middleware.js';
import { closeTransport } from './Utils/MailSender/mailSend.js';

// Routers
import staticRoutes from './Routes/staticRoutes.js';
import apiRoutes from './Routes/apiRoutes.js';

export const app = express();
const productionMode = process.env.NODE_ENV === 'production';
const testMode = process.env.NODE_ENV === 'test';

const dbUrl = productionMode
  ? process.env.prodDBUrl
  : testMode
  ? process.env.testDBUrl
  : process.env.devDBUrl;


// Start up the database instance
if (!testMode) {
  getDBInstance();
}

// For handling session
const MongoDBSession = mongoDBSession(session);
const store = new MongoDBSession({
  uri: dbUrl,
  collection: 'picskeepsession',
});

app.use(
  session({
    genid: () => genUUID(),
    secret: process.env.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store,
  })
);

// Handling JSON
app.use(express.json());

// Parsing url queries
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(express.static(path.join(path.resolve(), 'client', 'build')));

app.use('/', staticRoutes);

app.use('/api', isLoggedIn, apiRoutes);

// Serve react app here
if (productionMode) {
  app.get('/app/*', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'client', 'build', 'index.html'));
  });
}

// Handle all app errors
app.use((err, req, res, next) => {
  console.log('ServerErrorFound: An error was thrown');
  serverErrorFound(res, err, `An error occured on the server: ${err.stack}`);
});

const PORT = process.env.PORT || 5000;

if (!testMode) {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
}

// Handle other errors that cause app to exit, for cleanup
function handleAppClose(code) {
  console.log(`App exited with code: ${code}`);
  console.log('isDBCOnnected in exit: ', checkIfConnected());
  if (checkIfConnected()) {
    closeClientInstance();
    closeTransport();
  }
}
process.once('exit', handleAppClose);
process.once('SIGINT', handleAppClose);
process.once('SIGUSR2', handleAppClose);
// process.once('beforeExit', handleAppClose);
// process.once('SIGTERM', handleAppClose);
// process.once('SIGBREAK', handleAppClose);
// process.once('SIGTRAP', handleAppClose);

export default app;
