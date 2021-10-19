import express from 'express';
import { getDBInstance } from '../../Database/mongoDB.js';
import mongoTypes from 'mongodb';
const { ObjectId } = mongoTypes;
import {
  dbOperationError,
  executionError,
  serverErrorFound,
} from '../../Utils/errorHandling.js';
import { dbOpErrorMsg, errorTypes, serverErrMsg } from '../../config.js';
import Picture from '../../Database/Models/pictureModel.js';
import { appendPropertyName } from '../../Utils/utility.js';
import { deleteObject, renameObject } from '../../S3/awsModule.js';
const { updateerror } = errorTypes;

const router = express.Router();

// Deleting Picture
router.post('/delete', async (req, res) => {
  // delete the picture
  const { data } = req.body;

  try {
    const picture = new Picture(data).removeEmptyFields();
    console.log('Deleting Picture: ', picture);

    // Delete picture from s3
    const ops = await deleteObject(picture.fileName);

    if (ops.statusCode === 200) {
      try {
        const { userID } = req.session;
        const db = await getDBInstance();
        const users = db.collection('users');

        const deleteRes = await users.updateOne(
          { _id: ObjectId(userID) },
          { $pull: { pictures: { picID: picture.picID } } }
        );

        //   console.log('Deleted : ', deleteRes);

        const { acknowledged, modifiedCount } = deleteRes;
        if (acknowledged && modifiedCount) {
          // Fetch the information
          const info = await users.findOne(
            { _id: ObjectId(userID) },
            { projection: { password: 0, _id: 0 } }
          );
          res.status(200).json({
            app: { userInfo: info },
            flags: { isDeleted: { value: true } },
          });
        } else {
          executionError(
            res,
            500,
            errorTypes.deleteerror,
            'Could not delete picture. Contact Support'
          );
        }
      } catch (err) {
        dbOperationError(res, err, dbOpErrorMsg);
      }
    } else {
      throw new Error(ops);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

// Updating picture
router.post('/update', async (req, res) => {
  const { data } = req.body;
  const { oldFileName, newFileName, username } = data;
  const newBaseKey = `${username}/picture/${newFileName}`;

  try {
    const ops = await renameObject(oldFileName, newBaseKey);

    if (ops.statusCode === 200) {
      console.log('Updating picture: ', data);
      const { userID } = req.session;
      const db = await getDBInstance();
      const users = db.collection('users');

      const picture = new Picture(data).removeEmptyFields().convertToMongo();

      const propPic = appendPropertyName({ ...picture }, 'pictures.$');

      // console.log('Picture to update: ', propPic);

      try {
        const updateRes = await users.updateOne(
          { _id: ObjectId(userID), 'pictures.picID': picture.picID },
          { $set: propPic }
        );

        if (updateRes.acknowledged && updateRes.modifiedCount) {
          // Fetch the information
          const info = await users.findOne(
            { _id: ObjectId(userID) },
            { projection: { password: 0, _id: 0 } }
          );

          res.status(200).json({
            app: { userInfo: info },
            flags: { isUpdated: { value: true } },
          });
        } else {
          executionError(
            res,
            500,
            updateerror,
            'Could not delete picture. Contact Support'
          );
        }
      } catch (err) {
        dbOperationError(res, err, dbOpErrorMsg);
      }
    } else {
      throw new Error(ops);
    }
  } catch (err) {
    serverErrorFound(res, err, serverErrMsg);
  }
});

// Creating picture
router.post('/create', async (req, res) => {
  const { data } = req.body;

  data.fileName = `${data.username}/picture/${data.fileName}`;
  
  try {
    const picture = new Picture(data).removeEmptyFields().convertToMongo();
    console.log('Creating picture: ', picture);

    const { userID } = req.session;
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const updateRes = await users.updateOne(
        { _id: ObjectId(userID) },
        { $push: { pictures: picture } }
      );

      if (updateRes.acknowledged && updateRes.modifiedCount) {
        // Fetch the information
        const info = await users.findOne(
          { _id: ObjectId(userID) },
          { projection: { password: 0, _id: 0 } }
        );

        res.status(200).json({
          app: { userInfo: info },
          flags: { isUpdated: { value: true } },
        });
      } else {
        executionError(
          res,
          500,
          updateerror,
          'Could not delete picture. Contact Support'
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
