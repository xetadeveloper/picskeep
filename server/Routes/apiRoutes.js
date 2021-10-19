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
  // console.log('Test route called');
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

      console.log('Found User before adding url: ', foundUser);

      if (foundUser) {
        // Create presigned urls for pictures and add them to picture array
        const { pictures } = foundUser;

        foundUser.pictures = pictures.map(picture => {
          picture.url = getS3SignedUrl('get', picture.fileName);
          return picture;
        });

        console.log('Found User after adding url: ', foundUser);
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
router.get('/getSignedUrl', hasData, async (req, res) => {
  const { fileName } = req.body.data;

  const signedUrl = getPresignedUrl(fileName);
  console.log('Get Signed Url: ', signedUrl);

  res.status(200).json({ app: { getSignedUrl: { value: signedUrl } } });
});

// Gets multiple aws signed urls (mostly going to be used for uploading mutliple pictures)
router.get('/getMultipleSignedUrls', hasData, async (req, res) => {
  const { fileNames } = req.body.data;

  const multipleUrls = fileNames.map(fileName => {
    return { fileName: fileName, signedUrl: getPresignedUrl(fileName) };
  });

  console.log('Signed Urls: ', multipleUrls);

  res
    .status(200)
    .json({ app: { multipleSignedUrls: { value: multipleUrls } } });
});

// Send one PUT presigned url back to client
router.get('/putSignedUrl', hasData, async (req, res) => {
  const { fileName } = req.body.data;

  const signedUrl = putPresignedUrl(fileName);
  console.log('Put Signed Url: ', signedUrl);

  res.status(200).json({ app: { putSignedUrl: { value: signedUrl } } });
});

// Send many PUT presigned urls back to client
router.get('/putMultipleSignedUrls', hasData, async (req, res) => {
  const { fileNames } = req.body.data;

  const multipleUrls = fileNames.map(fileName => {
    return { fileName: fileName, signedUrl: putPresignedUrl(fileName) };
  });

  console.log('Signed Urls: ', multipleUrls);

  res
    .status(200)
    .json({ app: { multiplePutSignedUrls: { value: multipleUrls } } });
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
