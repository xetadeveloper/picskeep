import express from 'express';
import mongoTypes from 'mongodb';
const { ObjectId } = mongoTypes;
import {
  dbOpErrorMsg,
  serverErrMsg,
  errorTypes,
  saltRounds,
} from '../../config.js';
import { getDBInstance } from '../../Database/mongoDB.js';
import {
  badInputError,
  dbOperationError,
  executionError,
  serverErrorFound,
} from '../../Utils/errorHandling.js';
import bcrypt from 'bcrypt';
import { hasData } from '../../Middleware/middleware.js';
import User from '../../Database/Models/userModel.js';
import { deleteMultipleObjects } from '../../S3/awsModule.js';

const router = express.Router();

router.post('/delete', async (req, res) => {
  console.log('Deleting account...');

  try {
    //   First delete all pictures from s3
    const { userID } = req.session;
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      // Delete account from db
      const userInfo = await users.findOne({ _id: ObjectId(userID) });
      // console.log('UserInfo: ', userInfo);

      const delPics = userInfo.pictures.map(picture => picture.s3Key);

      // add profile picture to list
      delPics.push(userInfo.profilePic.s3Key);

      // console.log('Deleting accout pictures: ', delPics);

      try {
        const s3Del = await deleteMultipleObjects(delPics);

        if (s3Del.statusCode === 200) {
          const delRes = await users.deleteOne({ _id: ObjectId(userID) });

          // console.log('Delete response: ', delRes);

          if (delRes.acknowledged && delRes.deletedCount) {
            req.session.destroy();

            res.status(200).json({
              app: { isLoggedIn: false },
              flags: { isDeleted: { value: true } },
            });
          } else {
            executionError(
              res,
              500,
              errorTypes.deleteerror,
              'Could not delete user account. Contact Support'
            );
          }
        } else {
          executionError(
            res,
            500,
            errorTypes.deleteerror,
            'Unable to delete user pictures from storage. Contact Support'
          );
        }
      } catch (err) {
        serverErrorFound(
          res,
          err,
          'Error in deleting user objects from storage. Contact support'
        );
      }
    } catch (err) {
      dbOperationError(res, err, dbOpErrorMsg);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

router.post('/update', hasData, async (req, res) => {
  try {
    const { data } = req.body;
    console.log('Data received in update: ', data);
    const { username } = req.session;

    if (data.profilePic && Object.entries(data.profilePic).length) {
      data.profilePic.s3Key = `${username}/profile/${data.profilePic.fileName}`;
    }

    const user = new User(data).removeEmptyFields(true).convertToMongo();

    console.log('User info to update: ', user);

    const db = await getDBInstance();
    const users = db.collection('users');
    const { userID } = req.session;

    try {
      const update = await users.updateOne(
        { _id: ObjectId(userID) },
        { $set: user }
      );

      const { acknowledged, modifiedCount } = update;

      console.log('Update Resulr: ', update);

      if (acknowledged && modifiedCount) {
        const result = await users.findOne(
          { _id: ObjectId(userID) },
          { projection: { password: 0, _id: 0 } }
        );

        console.log('Find Result: ', result);

        if (result) {
          res.status(200).json({
            app: { userInfo: result },
            flags: { isUpdated: { value: true } },
          });
        } else {
          executionError(
            res,
            500,
            errorTypes.deleteerror,
            'Could not find user password. Contact Support'
          );
        }
      } else {
        executionError(
          res,
          500,
          errorTypes.deleteerror,
          'Unable to update user profile. Contact Support'
        );
      }
    } catch (err) {
      dbOperationError(res, err, dbOpErrorMsg);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

router.post('/passwordchange', hasData, async (req, res) => {
  const { data } = req.body;
  console.log('Changing password: ', data);
  const { oldPassword, newPassword } = data;
  // const userID = ObjectId(req.session.userID);
  const { userID } = req.session;

  try {
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const result = await users.findOne(
        { _id: userID },
        { projection: { password: 1 } }
      );

      // console.log('Search Result: ', result);
      if (result) {
        try {
          if (await bcrypt.compare(oldPassword, result.password)) {
            // Update password here
            const hash = await bcrypt.hash(newPassword, saltRounds);

            try {
              const updateRes = await users.updateOne(
                { _id: userID },
                { $set: { password: hash } }
              );

              // console.log('Update result: ', updateRes);
              const { acknowledged, modifiedCount } = updateRes;

              if (acknowledged && modifiedCount) {
                res.status(200).json({ flags: { isUpdated: { value: true } } });
              } else {
                executionError(
                  res,
                  500,
                  errorTypes.updateerror,
                  'Could not complete password update. Contact Support'
                );
              }
            } catch (err) {
              dbOperationError(res, err, dbOpErrorMsg);
            }
          } else {
            badInputError(res, [
              {
                field: 'oldPassword',
                message: 'Password supplied is incorrect',
              },
            ]);
          }
        } catch (err) {
          serverErrorFound(
            res,
            err,
            'Failed to compare old passwords. Contact Support'
          );
        }
      } else {
        executionError(
          res,
          500,
          errorTypes.deleteerror,
          'Could not find user password. Contact Support'
        );
      }
    } catch (err) {
      dbOperationError(res, err, dbOpErrorMsg);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

export default router;
