import express from 'express';
import { plainDummyUsers } from '../Database/Dummy/dummyUsers.js';
import { getDBInstance } from '../Database/mongoDB.js';
import bcrypt from 'bcrypt';
import {
  badInputError,
  dbOperationError,
  emptyRequestBodyError,
  serverErrorFound,
} from '../Utils/errorHandling.js';

const router = express.Router();
// ============ Normal routes =============
router.get('/test', (req, res) => {
  // console.log('Test route called');
  res.status(200).send('Working');
});

// ============ Routes for Home =============
router.get('/getUserInfo', async (req, res) => {
  console.log('Getting user info...');

  try {
    // res.status(200).json(plainDummyUsers[0]);
    const db = await getDBInstance();
    const users = db.collection('users');

    users.findOne();
  } catch (err) {
  } finally {
  }
});

// ============ Routes for Pictures =============
// ============ Routes for Folders =============
// ============ Routes for Preferences =============
// ============ Routes for Profile =============

export default router;

// async function getUserInfo() {
//   try {
//     getDBInstance();
//   } catch (err) {}
// }
