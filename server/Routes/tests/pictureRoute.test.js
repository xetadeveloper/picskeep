import app from '../../server.js';
import request from 'supertest';
import { cleanupDB, insertToDB } from './Test Handlers/testHandlers.js';
import { plainDummyUsers } from '../../Database/Dummy/dummyUsers.js';
import { errorTypes } from '../../config.js';

let userInfo;
let cookies;
const agent = request(app);
const loginInfo = {
  data: {
    username: 'linda',
    password: 'linda',
  },
};

beforeAll(async () => {
  const info = await insertToDB();
  userInfo = info;
});

afterAll(async () => {
  // Delete the dummy data (Create a util function for this for reusability in other tests)
  await cleanupDB();
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
      const newFileName = 'newpic.jpg';
      const id = 'picid1';
      const expUserInfo = { ...appResData };

      expUserInfo.pictures[0].fileName = newFileName;

      const expFlag = { isUpdated: { value: true } };

      const res = await agent
        .post('/api/picture/update')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { fileName: newFileName, picID: id } });

      const { userInfo } = res.body.app;
      const { isUpdated } = res.body.flags;

      console.log('Update Result: ', userInfo);
      console.log('Expected Update Result: ', expUserInfo);

      // Assertions
      expect(userInfo).toEqual(expUserInfo);
      expect(isUpdated).toEqual(expFlag.isUpdated);
    });

    test('Should update the size of the picture', async () => {
      const newSize = 7000;
      const id = 'picid1';
      const expUserInfo = { ...appResData };

      expUserInfo.pictures[0].size = newSize;

      const expFlag = { isUpdated: { value: true } };

      const res = await agent
        .post('/api/picture/update')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { size: newSize, picID: id } });

      const { userInfo } = res.body.app;
      const { isUpdated } = res.body.flags;

      console.log('Update Result: ', userInfo);
      console.log('Expected Update Result: ', expUserInfo);

      // Assertions
      expect(userInfo).toEqual(expUserInfo);
      expect(isUpdated).toEqual(expFlag.isUpdated);
    });

    test('Should update both size and url of the picture', async () => {
      const newSize = 7000;
      const newUrl = 'newurlpath';
      const id = 'picid1';
      const expUserInfo = { ...appResData };

      expUserInfo.pictures[0].size = newSize;
      expUserInfo.pictures[0].url = newUrl;

      const expFlag = { isUpdated: { value: true } };

      const res = await agent
        .post('/api/picture/update')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { size: newSize, url: newUrl, picID: id } });

      const { userInfo } = res.body.app;
      const { isUpdated } = res.body.flags;

      console.log('Update Result: ', userInfo);
      console.log('Expected Update Result: ', expUserInfo);

      // Assertions
      expect(userInfo).toEqual(expUserInfo);
      expect(isUpdated).toEqual(expFlag.isUpdated);
    });
  });

  describe('Tests for the picture deletion', () => {
    const appResData = plainDummyUsers[0];

    test('Should delete picture with ID of picid1', async () => {
      const id = 'picid1';
      const expUserInfo = { ...appResData };
      expUserInfo.pictures.shift();

      const expFlag = { isDeleted: { value: true } };

      const res = await agent
        .post('/api/picture/delete')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { picID: id } });

      const { userInfo } = res.body.app;
      const { isDeleted } = res.body.flags;

      // Assertions
      expect(userInfo).toEqual(expUserInfo);
      expect(isDeleted).toEqual(expFlag.isDeleted);
    });

    test('Should not delete a picture given wrong ID', async () => {
      const id = 'wrongid';
      const expRes = {
        app: {
          error: {
            type: errorTypes.updateerror,
            message: 'Could not delete picture. Contact Support',
          },
        },
      };

      const res = await agent
        .post('/api/picture/delete')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: { picID: id } });

      const { error } = res.body.app;

      // console.log('Received res: ', res.body);
      // console.log('Expected res: ', expRes);

      // Assertions
      expect(res.status).toBe(500);
      expect(res.type).toBe('application/json');
      expect(res.body).toEqual(expRes);
    });
  });

  describe('Tests for creating a picture', () => {
    const appResData = plainDummyUsers[0];

    test('Should create a picture and add to picture list', async () => {
      const newPic = {
        picID: 'idfornewpic',
        url: 'mynewurlpath',
        size: 17000,
        fileName: 'pic967.jpg',
      };
      const expUserInfo = { ...appResData };
      expUserInfo.pictures.push(newPic);

      const expFlag = { isCreated: { value: true } };

      const res = await agent
        .post('/api/picture/create')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .set('Content-Type', 'application/json')
        .send({ data: newPic });

      const { userInfo } = res.body.app;
      const { isCreated } = res.body.flags;

      // Assertions
      expect(userInfo).toEqual(expUserInfo);
      expect(isCreated).toEqual(expFlag.isCreated);
    });
  });
});


//