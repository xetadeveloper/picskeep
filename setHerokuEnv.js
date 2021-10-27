// Run script normally with node
// install heroku client first: npm i -D heroku-client
import Heroku from 'heroku-client';
import dotenv from 'dotenv';
import path from 'path';

const pathToEnv = `${path.join(path.resolve(), 'PicsKeep', '.env')}`;
console.log('Env path: ', pathToEnv);
dotenv.config({
  path: pathToEnv,
});

const herokuToken = process.env.herokuToken;
const appName = process.env.herokuAppName;

const heroku = new Heroku({
  token: herokuToken,
});

// Set your environment variables here
const envVars = {
  devDBUrl: process.env.devDBUrl,
  testDBUrl: process.env.testDBUrl,
  prodDBUrl: process.env.prodDBUrl,
  defaultDB: process.env.defaultDB,
  testDB: process.env.testDB,
  databaseList: process.env.databaseList,
  sessionSecret: process.env.sessionSecret,
  picsKeepEmail: process.env.picsKeepEmail,
  picsKeepPass: process.env.picsKeepPass,
  awsAccessID: process.env.awsAccessID,
  awsSecretAccessKey: process.env.awsSecretAccessKey,
  awsRegion: process.env.awsRegion,
  awsBucketName: process.env.awsBucketName,
  awsIAMUserIDs: process.env.awsIAMUserIDs,
  debugMode: process.env.debugMode,
};

// console.log('Env Vars: ', envVars);
console.log('Sending request...');

heroku
  .request({
    method: 'PATCH',
    path: `https://api.heroku.com/apps/${appName}/config-vars`,
    body: envVars,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/vnd.heroku+json; version=3',
    },
    parseJSON: true,
    token: herokuToken,
  })
  .then(response => {
    console.log('Response: ', response);
  })
  .catch(err => {
    console.log('Error Found: ', err);
  });
