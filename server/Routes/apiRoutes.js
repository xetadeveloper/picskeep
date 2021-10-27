import express from 'express';
import { getDBInstance } from '../Database/mongoDB.js';
import pictureRoutes from './ApiSubRoutes/pictureRoute.js';
import folderRoutes from './ApiSubRoutes/folderRoute.js';
import profileRoutes from './ApiSubRoutes/profileRoute.js';
import prefRoutes from './ApiSubRoutes/prefRoutes.js';
import { errorTypes } from '../config.js';
import { hasData } from '../Middleware/middleware.js';
import {
  dbOperationError,
  executionError,
  serverErrorFound,
} from '../Utils/errorHandling.js';
import { getPresignedUrl, putPresignedUrl } from '../S3/awsModule.js';

const router = express.Router();

// ============ Normal routes =============
router.get('/test', (req, res) => {
  console.log('Test route called');
  res.status(200).send('Working');
});

// ============ Routes for Home =============
router.get('/getUserInfo', async (req, res) => {
  try {
    const { userID } = req.session;

    console.log('Getting user info...', userID);

    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const foundUser = await users.findOne(
        { _id: userID },
        { projection: { password: 0 } }
      );

      // console.log('Found User before adding url: ', foundUser);

      if (foundUser) {
        // console.log('Found User after adding url: ', foundUser);
        res.status(200).json({
          app: { userInfo: foundUser },
        });
      } else {
        executionError(
          res,
          401,
          errorTypes.notfounderror,
          'Could not find user info in DB. Contact Support'
        );
      }
    } catch (err) {
      dbOperationError(res, err, dbOpErrorMsg);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

// Gets one aws signed url
router.post('/getSignedUrl', hasData, async (req, res) => {
  const { s3Key } = req.body.data;
  console.log('Sending aws get url...');

  const signedUrl = await getPresignedUrl(s3Key);
  // // console.log('Get Signed Url: ', signedUrl);

  res.status(200).json({ signedUrl });
});

// Gets multiple aws signed urls (mostly going to be used for uploading mutliple pictures)
router.post('/getMultipleSignedUrls', hasData, async (req, res) => {
  const { fileNames, folderPath } = req.body.data;
  const { username } = req.session;

  const multipleUrls = await Promise.all(
    fileNames.map(async fileName => {
      const key = `${username}/${folderPath}/${fileName}`;
      const signedUrl = await getPresignedUrl(key);
      return { fileName, signedUrl };
    })
  );

  // console.log('Signed Urls: ', multipleUrls);

  res.status(200).json({ app: { getUrls: multipleUrls } });
});

// Send one PUT presigned url back for profile uploading to client
router.post('/putSignedUrl', hasData, async (req, res) => {
  console.log('Sending aws put url');
  const { fileName } = req.body.data;

  const { username } = req.session;
  const key = `${username}/profile/${fileName}`;

  const signedUrl = await putPresignedUrl(key);
  // // console.log('Put Signed Url: ', signedUrl);

  res.status(200).json({ signedUrl });
});

// Send many PUT presigned urls for picture uploading back to client
router.post('/putMultipleSignedUrls', hasData, async (req, res) => {
  console.log('Generating put urls: ', req.body.data);
  const { fileNames } = req.body.data;
  const { username } = req.session;

  const multipleUrls = await Promise.all(
    fileNames.map(async fileName => {
      const key = `${username}/picture/${fileName}`;
      const signedUrl = await putPresignedUrl(key);
      return { fileName, signedUrl };
    })
  );

  // console.log('Signed Urls: ', multipleUrls);

  res.status(200).json({ app: { putUrls: multipleUrls } });
});

// ============ Routes for Pictures =============
router.use('/picture', hasData, pictureRoutes);
// ============ Routes for Folders =============
router.use('/folder', folderRoutes);
// ============ Routes for Preferences =============
router.use('/preferences', prefRoutes);
// ============ Routes for Profile =============
router.use('/profile', profileRoutes);

export default router;
