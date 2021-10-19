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

export async function insertToDB() {
  // Insert dummy data into db (Create a util function for this for reusability in other tests)
  try {
    const db = await getDBInstance();
    const users = db.collection('users');

    // console.log('Info to insert: ', mongoDummyUsers);
    const result = await users.insertMany(mongoDummyUsers);

    // console.log('Insert Result: ', result);

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
    console.log('Error occured in beforeAll test handler: ', err);
  }
}

export async function cleanupDB() {
  try {
    const db = await getDBInstance();
    const users = db.collection('users');
    const sessionCol = db.collection('picskeepsession');
    const result = await users.deleteMany({});

    const sessResult = await sessionCol.deleteMany({});

    // console.log('User Delete Result: ', result);
    // console.log('Session Delete Result: ', sessResult);
  } catch (err) {
    console.log('Error occured in afterAll test handler: ', err);
  } finally {
    closeClientInstance();
    closeTransport();
    // console.log('After all we did');
  }
}
