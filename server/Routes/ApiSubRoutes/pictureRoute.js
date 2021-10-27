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
import {
  deleteMultipleObjects,
  deleteObject,
  renameObject,
} from '../../S3/awsModule.js';
const { updateerror } = errorTypes;

const router = express.Router();

// Deleting One Picture
router.post('/delete', async (req, res) => {
  // delete the picture
  const { data } = req.body;
  const { username } = req.session;

  console.log('Delete Data: ', data);

  try {
    const picture = new Picture(data.pic)
      .createS3Key(`${username}/picture`)
      .removeEmptyFields();

    // console.log('Deleting Picture: ', picture);

    // Delete picture from s3
    const ops = await deleteObject(picture.s3Key);

    if (ops.statusCode === 200) {
      try {
        const { userID } = req.session;
        const db = await getDBInstance();
        const users = db.collection('users');

        const deleteRes = await users.updateOne(
          { _id: ObjectId(userID) },
          { $pull: { pictures: { picID: picture.picID } } }
        );

        //   // console.log('Deleted : ', deleteRes);

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

// Deleting many pictures (To be done later)

// Updating picture
router.post('/update', async (req, res) => {
  const { data } = req.body;
  const { picture, newFileName } = data;
  console.log('Updating picture: ', data);

  const { username } = req.session;
  const oldPic = new Picture(picture).createS3Key(`${username}/picture`);

  const newPic = new Picture({
    ...picture,
    fileName: newFileName,
  }).createS3Key(`${username}/picture`);

  try {
    const ops = await renameObject(oldPic.s3Key, newPic.s3Key);

    if (ops.statusCode === 200) {
      const { userID } = req.session;
      const db = await getDBInstance();
      const users = db.collection('users');

      const propPic = appendPropertyName(
        { ...newPic.removeEmptyFields().convertToMongo() },
        'pictures.$'
      );

      // // console.log('Picture to update: ', propPic);

      try {
        const updateRes = await users.updateOne(
          { _id: ObjectId(userID), 'pictures.picID': newPic.picID },
          { $set: propPic }
        );

        // // console.log('Update response: ', updateRes);

        if (updateRes.acknowledged && updateRes.modifiedCount) {
          // Fetch the information
          const info = await users.findOne(
            { _id: ObjectId(userID) },
            { projection: { password: 0, _id: 0 } }
          );

          // // console.log('info: ', info);

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

// Creating one picture
router.post('/create', async (req, res) => {
  const { data } = req.body;
  const { picInfo } = data;
  const { username } = req.session;

  try {
    const picture = new Picture(picInfo)
      .createS3Key(`${username}/picture`)
      .removeEmptyFields();
    console.log('Creating picture: ', picture);

    const { userID } = req.session;
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const updateRes = await users.updateOne(
        { _id: ObjectId(userID) },
        { $push: { pictures: picture.convertToMongo() } }
      );

      if (updateRes.acknowledged && updateRes.modifiedCount) {
        // Fetch the information
        const info = await users.findOne(
          { _id: ObjectId(userID) },
          { projection: { password: 0, _id: 0 } }
        );

        res.status(200).json({
          app: { userInfo: info },
          flags: { isCreated: { value: true } },
        });
      } else {
        // Delete picture from s3
        const delRes = await deleteObject(picture.s3Key);

        if (delRes.statusCode === 200) {
          executionError(
            res,
            500,
            updateerror,
            'Could not add picture to DB. Contact Support'
          );
        } else {
          executionError(
            res,
            500,
            updateerror,
            'Could not add picture to DB and failed to delete picture from storage. Contact Support'
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

// Creating many pictures
router.post('/createMany', async (req, res) => {
  const { data } = req.body;
  const { fileNames } = data;
  const { username } = req.session;

  try {
    const pictures = fileNames.map(file => {
      return new Picture({ fileName: file, type: 'picture' })
        .createID()
        .createS3Key(`${username}/picture`)
        .removeEmptyFields();
    });

    console.log('Creating pictures: ', pictures);

    const { userID } = req.session;
    const db = await getDBInstance();
    const users = db.collection('users');

    try {
      const updateRes = await users.updateOne(
        { _id: ObjectId(userID) },
        {
          $push: {
            pictures: { $each: pictures.map(pic => pic.convertToMongo()) },
          },
        }
      );

      if (updateRes.acknowledged && updateRes.modifiedCount) {
        // Fetch the information
        const info = await users.findOne(
          { _id: ObjectId(userID) },
          { projection: { password: 0, _id: 0 } }
        );

        res.status(200).json({
          app: { userInfo: info },
          flags: { isCreated: { value: true } },
        });
      } else {
        // Delete pictures from s3
        const delRes = await deleteMultipleObjects(
          pictures.map(pic => pic.s3Key)
        );

        if (delRes.statusCode === 200) {
          executionError(
            res,
            500,
            updateerror,
            'Could not add picture to DB. Contact Support'
          );
        } else {
          executionError(
            res,
            500,
            updateerror,
            'Could not add picture to DB and failed to delete picture from storage. Contact Support'
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
