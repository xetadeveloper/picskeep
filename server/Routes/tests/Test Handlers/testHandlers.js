import {
  closeClientInstance,
  getDBInstance,
} from '../../../Database/mongoDB.js';
import { closeTransport } from '../../../Utils/MailSender/mailSend.js';
import {
  dummyUsers,
  mongoDummyUsers,
  plainDummyUsers,
} from '../../../Database/Dummy/dummyUsers.js';
import { closeS3Client } from '../../../S3/awsModule.js';

export async function insertToDB() {
  try {
    const db = await getDBInstance();
    const users = db.collection('users');

    console.log('Info to insert: ', mongoDummyUsers[0]);
    const result = await users.insertOne(mongoDummyUsers[0]);

    console.log('Insert Result: ', result);

    const userInfo = await users.find({
      username: { $in: mongoDummyUsers.map(user => user.username) },
    });

    const allInfo = await userInfo.toArray();

    // console.log('userInfo: ', allInfo);

    return allInfo.map(info => {
      delete info._id;
      return info;
    });
  } catch (err) {
    console.log('Error occured in insertDB test handler: ', err);
  }
}

export async function clearUsersCollection(db) {
  try {
    const db = await getDBInstance();
    const users = db.collection('users');
    const result = await users.deleteMany({});
  } catch (err) {
    console.log(
      'Error occured in clearing users collection test handler: ',
      err
    );
  }
}

export async function cleanupDB(cleanUsers) {
  try {
    const db = await getDBInstance();

    if (cleanUsers) {
      await clearUsersCollection();
    }

    const sessionCol = db.collection('picskeepsession');
    const sessResult = await sessionCol.deleteMany({});
  } catch (err) {
    console.log('Error occured in clearing session collection handler: ', err);
  } finally {
    closeClientInstance();
    closeTransport();
    closeS3Client();
    // console.log('After all we did');
  }
}
