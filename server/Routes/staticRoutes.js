import express from 'express';
import path from 'path';
import { getDBInstance } from '../Database/mongoDB.js';
import bcrypt from 'bcrypt';
import {
  badInputError,
  dbOperationError,
  serverErrorFound,
} from '../Utils/errorHandling.js';

const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res
    .status(200)
    .sendFile(
      path.join(path.resolve(), 'server', 'HTML', 'Home', '/home.html')
    );
});

// Contact Page
router.get('/contact', (req, res) => {
  res
    .status(200)
    .sendFile(
      path.join(path.resolve(), 'server', 'HTML', 'Contact', '/contact.html')
    );
});

// About Page
router.get('/about', (req, res) => {
  res
    .status(200)
    .sendFile(
      path.join(path.resolve(), 'server', 'HTML', 'About', '/about.html')
    );
});

// login
router.post('/login', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Object.entries(data).length) {
      emptyRequestBodyError(res);
      return;
    }

    console.log('Logging user in: ', data);

    const { username, password } = data;
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const result = await users.findOne(
        { username: username },
        { projection: { username: 1, password: 1, _id: 1 } }
      );

      // console.log('DB Find Result: ', result);

      if (result) {
        // Compare passwords
        if (await bcrypt.compare(password, result.password)) {
          // console.log('Password correct');
          // Create session
          req.session.username = result.username;
          req.session.userID = result._id;

          // Send logged in to client
          req.res.status(200).json({
            app: {
              isLoggedIn: true,
            },
          });
        } else {
          console.log('Password not correct');
          badInputError(res, [
            {
              field: 'password',
              message: `User password incorrect`,
            },
          ]);
        }
      } else {
        badInputError(res, [
          {
            field: 'username',
            message: `User with username ${username} does not exist`,
          },
        ]);
      }
    } catch (err) {
      dbOperationError(res, err, err.stack);
    }
  } catch (err) {
    serverErrorFound(res, err, err.stack);
  }
});

// Signup
router.post('/signup', async (req, res) => {});

export default router;
