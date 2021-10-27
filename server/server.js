// Modules
import './config.js';
import express from 'express';
import { getDBInstance } from './Database/mongoDB.js';
import path from 'path';
import session from 'express-session';
import mongoDBSession from 'connect-mongodb-session';
import { serverErrorFound } from './Utils/errorHandling.js';
import { v4 as genUUID } from 'uuid';
import { isLoggedInAPI, isLoggedInRedirect } from './Middleware/middleware.js';
import cleanupServer from './Utils/cleanup.js';
import { getS3Client, testAWSCommands } from './S3/awsModule.js';

// Routers
import staticRoutes from './Routes/staticRoutes.js';
import apiRoutes from './Routes/apiRoutes.js';

export const app = express();
app.disable('x-powered-by');
app.enable('strict routing');

console.log('Strict routing enabled: ', app.enabled('strict routing'));

const productionMode = process.env.NODE_ENV === 'production';
const testMode = process.env.NODE_ENV === 'test';

const dbUrl = productionMode
  ? process.env.prodDBUrl
  : testMode
  ? process.env.testDBUrl
  : process.env.devDBUrl;

// Start up the database instance and s3 client
if (!testMode) {
  await getDBInstance();
}

await getS3Client(false);

// Mongodb session store config
const MongoDBStore = mongoDBSession(session);
const store = new MongoDBStore({
  uri: dbUrl,
  collection: 'picskeepsession',
  expires: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  },
});

// Express session config
app.use(
  session({
    genid: () => genUUID(),
    secret: process.env.sessionSecret,
    saveUninitialized: false,
    resave: false,
    store,
    cookie: {
      name: 'picskeepid', //name of sessionid
      rolling: true, //makes it that max-age is extended from last reques-response cycle
      maxAge: 432000000, //when session should expire (5 days)
    },
  })
);

// Handling JSON
app.use(express.json());

// Parsing url queries
app.use(express.urlencoded({ extended: true }));

// Static assets
app.use(
  express.static(path.join(path.resolve(), 'server', 'Public'), {
    // fallthrough: false,
    redirect: false,
    dotfiles: 'ignore',
  })
);

app.use(express.static(path.join(path.resolve(), 'client', 'build')));

// Routes
app.use('/', staticRoutes);

// REST API
app.use('/api', isLoggedInAPI, apiRoutes);

// Serve react app here
// if (productionMode) {
app.get(['/app', '/app/*'], isLoggedInRedirect, (req, res) => {
  console.log('Request for react app');
  res.sendFile(path.join(path.resolve(), 'client', 'build', 'app.html'));
});
// }

// Handle all app errors
app.use((err, req, res, next) => {
  console.log('Catch All: ServerErrorFound: An error was thrown');
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
process.once('exit', cleanupServer);
process.once('SIGINT', cleanupServer);
process.once('SIGUSR2', cleanupServer);
// process.once('beforeExit', handleAppClose);
// process.once('SIGTERM', handleAppClose);
// process.once('SIGBREAK', handleAppClose);
// process.once('SIGTRAP', handleAppClose);

export default app;
