import express from 'express';
import path from 'path';
import { getDBInstance } from '../Database/mongoDB.js';
import bcrypt from 'bcrypt';
import {
  badInputError,
  dbOperationError,
  executionError,
  serverErrorFound,
} from '../Utils/errorHandling.js';
import { hasData } from '../Middleware/middleware.js';
import User from '../Database/Models/userModel.js';
import { dbOpErrorMsg, errorTypes, serverErrMsg } from '../config.js';

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
router.post('/login', hasData, async (req, res) => {
  try {
    const { data } = req.body;

    console.log('Logging user in: ', data);

    const { username, password, saveSession } = data;
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
          if (!saveSession) {
            // Make session expire after browser/page close
            req.session.cookie.expires = false;
          }

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
router.post('/signup', hasData, async (req, res) => {
  const { data } = req.body;

  try {
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const findCursor = await users.find({
        $or: [{ username: data.username }, { email: data.email }],
      });

      const findResult = await findCursor.toArray();

      if (findResult.length) {
        const usernameError = {
          field: 'username',
          message: 'Username may already be taken',
        };
        const emailError = {
          field: 'email',
          message: 'This email may have been used already',
        };

        const errorFields = [];

        let addUsernameError = false;
        let addEmailError = false;

        findResult.forEach(result => {
          if (result.username === data.username) {
            addUsernameError = true;
          }

          if (result.email === data.email) {
            addEmailError = true;
          }

          return true;
        });

        if (addUsernameError) {
          errorFields.push(usernameError);
        }

        if (addEmailError) {
          errorFields.push(emailError);
        }

        badInputError(res, errorFields);
      } else {
        // Hash password
        const hashedUser = await new User(data).hashPassword();
        const user = hashedUser.removeEmptyFields().convertToMongo();
        const { acknowledged } = await users.insertOne(user);

        if (acknowledged) {
          res.status(201).end();
        } else {
          executionError(
            res,
            500,
            errorTypes.inserterror,
            'User was not signed up. Please contact support'
          );
        }
      }
    } catch (err) {
      dbOperationError(res, err, dbOpErrorMsg);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

export default router;
