import app from '../../server.js';
import request from 'supertest';
import {
  cleanupDB,
  clearUsersCollection,
  insertToDB,
} from './Test Handlers/testHandlers.js';
import { plainDummyUsers } from '../../Database/Dummy/dummyUsers.js';
import { errorTypes } from '../../config.js';
import {
  putPresignedUrl,
  deleteMultipleObjects,
  putObject,
} from '../../S3/awsModule.js';

let userInfo;
let cookies;
const agent = request(app);
const loginInfo = {
  data: {
    username: 'linda',
    password: 'linda',
  },
};

// Objects that were created in S3 by tests
const s3Objects = [];

beforeAll(async () => {
  s3Objects.push('userfile.jpg');
  const signedUrl = await putPresignedUrl(
    `${loginInfo.data.username}/picture/userfile.jpg`
  );

  const filePath = 'C:/Users/Fego/Pictures/Wallpapers/352112.jpg';
  await putObject(signedUrl, filePath);
});

beforeEach(async () => {
  const info = await insertToDB();
  userInfo = info;
});

afterEach(async () => {
  await clearUsersCollection();
});

afterAll(async () => {
  // Delete the dummy data (Create a util function for this for reusability in other tests)
  await cleanupDB();
  console.log('Deleting ojects from s3: ', s3Objects);
  await deleteMultipleObjects(
    s3Objects.map(obj => `${loginInfo.data.username}/picture/${obj}`)
  );
});

// Testing picture CRUD
describe('Testing the Update and Delete for picture routes', () => {
  test('Should login user properly', async () => {
    const loginRes = { app: { isLoggedIn: true } };
    const res = await agent
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(loginInfo);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(loginRes);
    expect(res.type).toBe('application/json');
    expect(res.headers).toHaveProperty('set-cookie');
    cookies = res.headers['set-cookie'].pop().split(';')[0];
  });

  describe('Tests for the picture update', () => {
    const appResData = plainDummyUsers[0];
    delete appResData.password;

    test('Should update the file name of the picture', async () => {
      const newFileName = 'copiedfile.jpg';
      s3Objects.push(newFileName);

      const expFlag = { isUpdated: { value: true } };

      const res = await agent
        .post('/api/picture/update')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({
          data: {
            picture: appResData.pictures[0],
            newFileName,
          },
        });

      const expRes = {
        ...appResData.pictures[0],
        fileName: newFileName,
        s3Key: `${loginInfo.data.username}/picture/${newFileName}`,
      };

      const { userInfo } = res.body.app;
      const { isUpdated } = res.body.flags;
      console.log('Update Result: ', userInfo.pictures[0]);
      console.log('Expected Update Result: ', expRes);

      // Assertions
      expect(userInfo.pictures[0]).toEqual(expRes);
      expect(isUpdated).toEqual(expFlag.isUpdated);
    });
  });

  describe('Tests for creating a picture', () => {
    const appResData = plainDummyUsers[0];

    test('Should create a picture and add to picture list', async () => {
      const newPic = {
        picID: 'idfornewpic',
        fileName: 'addedFile.jpg',
      };

      s3Objects.push(newPic.fileName);

      const res = await agent
        .post('/api/picture/create')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { picInfo: newPic } });

      const expUserInfo = {
        ...appResData,
        pictures: [...appResData.pictures],
      };
      newPic.s3Key = `${loginInfo.data.username}/picture/${newPic.fileName}`;
      expUserInfo.pictures.push(newPic);

      const expFlag = { isCreated: { value: true } };

      const { userInfo } = res.body.app || {};
      const { isCreated } = res.body.flags || {};

      // Assertions
      // console.log('Received pictures: ', userInfo.pictures);
      // console.log('Expected pictures: ', expUserInfo.pictures);
      expect(userInfo.pictures).toEqual(expUserInfo.pictures);
      expect(isCreated).toEqual(expFlag.isCreated);
    });
  });

  describe('Tests for the picture deletion', () => {
    const appResData = plainDummyUsers[0];

    test('Should delete picture with ID of picid1', async () => {
      const expUserInfo = {
        ...appResData,
        pictures: [...appResData.pictures],
      };

      expUserInfo.pictures.shift();

      const expFlag = { isDeleted: { value: true } };

      const res = await agent
        .post('/api/picture/delete')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { pic: appResData.pictures[0] } });

      const { userInfo } = res.body.app;
      const { isDeleted } = res.body.flags;

      // Assertions
      expect(userInfo).toEqual(expUserInfo);
      expect(isDeleted).toEqual(expFlag.isDeleted);
    });

    test('Should not delete a picture given wrong ID', async () => {
      const expRes = {
        app: {
          error: {
            type: errorTypes.deleteerror,
            message: 'Could not delete picture. Contact Support',
          },
        },
      };

      const res = await agent
        .post('/api/picture/delete')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({
          data: {
            pic: {
              id: 'worngid',
              filename: 'notusreexists.jpg',
            },
          },
        });

      const { error } = res.body.app;

      // console.log('Received res: ', res.body);
      // console.log('Expected res: ', expRes);

      // Assertions
      expect(res.status).toBe(500);
      expect(res.type).toBe('application/json');
      expect(res.body).toEqual(expRes);
    });
  });
});

//
