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
router.get('/login', async (req, res) => {
  res
    .status(200)
    .sendFile(
      path.join(path.resolve(), 'server', 'HTML', 'Login', '/login.html')
    );
});

router.post('/login', hasData, async (req, res) => {
  try {
    const { data } = req.body;

    console.log('Logging user in: ', data);

    const hasMissing = [];

    const { username, password, saveSession } = data;

    // Do server side validation
    const missingMsg = 'Required field not filled';
    if (!username || (username && !username.value)) {
      hasMissing.push({ field: 'username', message: missingMsg });
    }
    if (!password || (password && !password.value)) {
      hasMissing.push({ field: 'password', message: missingMsg });
    }
    if (!saveSession || (saveSession && !saveSession.value)) {
      data.saveSession.value = false;
    }

    if (hasMissing.length) {
      badInputError(res, hasMissing);
      return;
    }

    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const result = await users.findOne(
        { username: username.value },
        { projection: { username: 1, password: 1, _id: 1 } }
      );

      // console.log('DB Find Result: ', result);

      if (result) {
        // Compare passwords
        if (await bcrypt.compare(password.value, result.password)) {
          // console.log('Password correct');
          // Create session
          req.session.username = result.username;
          req.session.userID = result._id;
          if (!data.saveSession.value) {
            // Make session expire after browser/page close
            // console.log('Setting cookie to session');
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
              field: password.fieldId,
              message: `User password incorrect`,
            },
          ]);
        }
      } else {
        console.log('user not found');
        badInputError(res, [
          {
            field: username.fieldId,
            message: `User with username ${username.value} does not exist`,
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

  const hasMissing = [];

  const { username, password, email, firstName, lastName, saveSession } = data;

  console.log('Signing user up: ', data);

  // Do server side validation
  const missingMsg = 'Required field not filled';
  if (!username || (username && !username.value)) {
    hasMissing.push({ field: 'username', message: missingMsg });
  }
  if (!password || (password && !password.value)) {
    hasMissing.push({ field: 'password', message: missingMsg });
  }
  if (!email || (email && !email.value)) {
    hasMissing.push({ field: 'email', message: missingMsg });
  }
  if (!firstName || (firstName && !firstName.value)) {
    hasMissing.push({ field: 'firstName', message: missingMsg });
  }
  if (!lastName || (lastName && !lastName.value)) {
    hasMissing.push({ field: 'lastName', message: missingMsg });
  }
  if (!saveSession || (saveSession && !saveSession.value)) {
    data.saveSession.value = false;
  }

  if (hasMissing.length) {
    badInputError(res, hasMissing);
    return;
  }

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
        const userData = {
          username: username.value,
          password: password.value,
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
        };

        const hashedUser = await new User(userData).hashPassword();
        hashedUser.preferences.saveSession = data.saveSession.value;

        const user = hashedUser.removeEmptyFields().convertToMongo();
        const { acknowledged } = await users.insertOne(user);

        if (acknowledged) {
          const result = await users.findOne(
            { username: username.value },
            { projection: { username: 1, password: 1, _id: 1 } }
          );

          if (result) {
            req.session.username = result.username;
            req.session.userID = result._id;
            if (!data.saveSession.value) {
              // Make session expire after browser/page close
              req.session.cookie.expires = false;
            }
            res.status(201).end();
          } else {
            executionError(
              res,
              500,
              errorTypes.inserterror,
              'You may have been signed up but record cannot be found. Please try to login and if it fails,  contact support'
            );
          }
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

// For restoring session
router.get('/restoreSession', async (req, res) => {
  console.log('Restoring session');

  // Check the session store if there's any session available
  if (req.session.userID) {
    res.status(200).json({
      app: {
        isLoggedIn: true,
      },
    });
  } else {
    console.log('Redirecting back to login...');
    res.status(400).json({
      app: { isLoggedIn: false, redirectToLogin: true },
    });
  }
});

// For logging user out
router.get('/logout', async (req, res) => {
  console.log('Logging out');

  req.session.destroy();
  req.session.cookie.maxAge(0);
  res.status(200).json({
    app: { redirectToLogin: true, isLoggedIn: false },
  });
});

export default router;
