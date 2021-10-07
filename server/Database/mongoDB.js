import mongo from 'mongodb';
import {
  DBCollections,
  validationAction,
  validationLevel,
} from './Validators/validator.js';
// import { serverErrorFound } from '../Utility/errorHandling.js';

const { MongoClient } = mongo;
const productionMode = process.env.NODE_ENV == 'production';

const defaultDB = process.env.defaultDB;
const dbUrl = productionMode ? process.env.prodDBUrl : process.env.devDBUrl;

const DBPool = {};
let client;

async function connectDB(dbName = defaultDB) {
  // console.log('DBUrl: ', dbUrl);
  if (!client) {
    client = new MongoClient(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
    } catch (err) {
      console.log('Error Occured: ', err.message);
      throw err;
    }
  }

  const db = client.db(dbName);
  if (!(await checkDBExists(db, dbName))) {
    console.log('DB does not exist');
    await configureDB(db, DBCollections, validationLevel, validationAction);
    console.log('Database created');
  }

  // Add to database pool
  DBPool[dbName] = db;

  return db;
}

async function checkDBExists(db, dbName) {
  let exists = false;
  await db
    .admin()
    .listDatabases()
    .then(list => {
      // console.log('List: ', list);
      list.databases.forEach(database => {
        if (database.name === dbName) {
          exists = true;
        }
      });
    });

  return exists;
}

async function configureDB(db, collections, validationLevel, validationAction) {
  try {
    // Setup DB for first time use
    collections.forEach(coll => {
      console.log(`Creating collection ${coll.name}...`);

      db.createCollection(coll.name, {
        validator: coll.validator,
        validationAction,
        validationLevel,
      })
        .then(createdColl => {
          // console.log(`Collection ${coll.name} created...`);
          // if (!productionMode) {
          //   // Create dummy data
          //   createdColl.insertMany(coll.dummyData)
          // }
        })
        .catch(err => {
          console.log('Error Occured In Creating Collections: ', err);
          throw err;
        });
    });
  } catch (err) {
    console.log('Error Occured In Overall Creation: ', err);
    throw err;
  }
}

/** This function gets the database instance if found in the pool or creates a new connection and returns that
 * @param {String} dbName Name of the database to get the instance
 * @returns a mongoDB database instance
 */
export async function getDBInstance(dbName = defaultDB) {
  if (DBPool[dbName]) {
    // console.log('DB already connected..');
    return DBPool[dbName];
  } else {
    // console.log('DB not connected....');
    try {
      // console.log('DB Name: ', dbName);
      connectDB(dbName).then(db => {
        return db;
      });
    } catch (err) {
      throw err;
    }
  }
}

export function closeClientInstance() {
  if (client) {
    try {
      client.close();
      console.log('Client has been closed...');
    } catch (err) {
      throw err;
    }
  } else {
    console.log('Client was not initialized...');
  }
}
