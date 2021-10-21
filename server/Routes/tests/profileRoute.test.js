import app from '../../server.js';
import request from 'supertest';
import {
  cleanupDB,
  clearUsersCollection,
  insertToDB,
} from './Test Handlers/testHandlers.js';
import { plainDummyUsers } from '../../Database/Dummy/dummyUsers.js';

let userInfo;
let cookies;
const agent = request(app);

const loginInfo = {
  data: {
    username: 'linda',
    password: 'linda',
  },
};

afterAll(async () => {
  // Delete the dummy data (Create a util function for this for reusability in other tests)
  await cleanupDB(true);
});

// Testing picture CRUD
describe('Tests for the Profile Routes', () => {
  describe('Tests for login', () => {
    beforeAll(async () => {
      const info = await insertToDB();
      userInfo = info;
    });

    test('Should login user', async () => {
      const loginRes = { app: { isLoggedIn: true } };
      const res = await agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(loginInfo);

      // console.log('Login res headers: ', res.headers);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(loginRes);
      expect(res.type).toBe('application/json');
      expect(res.headers).toHaveProperty('set-cookie');
      cookies = res.headers['set-cookie'].pop().split(';')[0];
    });
  });

  // test for updating user profile
  describe('Tests for profile update', () => {
    beforeAll(async () => {
      await clearUsersCollection();
    });

    beforeEach(async () => {
      const info = await insertToDB();
      userInfo = info;
    });

    afterEach(async () => {
      await clearUsersCollection();
    });

    let appResData = { ...plainDummyUsers[0] };
    delete appResData.password;

    test('Should update username and email', async () => {
      const username = 'george79';

      const updateInfo = {
        username,
        email: 'george@lackomail.com',
      };

      const expInfo = { ...appResData, ...updateInfo };

      const expRes = {
        app: { userInfo: expInfo },
        flags: { isUpdated: { value: true } },
      };

      const res = await agent
        .post('/api/profile/update')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .send({ data: updateInfo });

      expect(res.body).toEqual(expRes);
    });

    test('Should update firstname and lastname', async () => {
      const updateInfo = {
        firstName: 'Georgey',
        lastName: 'Boon',
      };

      const expInfo = { ...appResData, ...updateInfo };

      const expRes = {
        app: { userInfo: expInfo },
        flags: { isUpdated: { value: true } },
      };

      const res = await agent
        .post('/api/profile/update')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .send({ data: updateInfo });

      expect(res.body).toEqual(expRes);
    });

    test('Should update profile picture url', async () => {
      const updateInfo = {
        profilePic: {
          fileName: 'newpic.jpg',
        },
      };

      console.log('AppResData: ', appResData);
      const expInfo = { ...appResData, ...updateInfo };

      const expRes = {
        app: { userInfo: expInfo },
        flags: { isUpdated: { value: true } },
      };

      const res = await agent
        .post('/api/profile/update')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .send({ data: updateInfo });

      expRes.app.userInfo.profilePic.s3Key = `${loginInfo.data.username}/profile/${updateInfo.profilePic.fileName}`;
      expect(res.body).toEqual(expRes);
    });

    test('Should return error with no data passed in', async () => {
      const updateInfo = {};

      const expRes = {
        app: {
          error: {
            type: 'emptybodyerror',
            message: 'Required data not found',
          },
        },
      };

      const res = await agent
        .post('/api/profile/update')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies])
        .send({ data: updateInfo });

      expect(res.body).toEqual(expRes);
    });
  });

  // test for updating user password
  describe('Tests for password update', () => {
    beforeAll(async () => {
      await clearUsersCollection();
      const info = await insertToDB();
      userInfo = info;
    });

    const newPassword = 'bob';

    test('Password should be updated given the correct old password', async () => {
      console.log('First test for password: ');
      const expRes = { flags: { isUpdated: { value: true } } };
      const clientInfo = {
        data: { oldPassword: loginInfo.data.password, newPassword },
      };

      const res = await agent
        .post('/api/profile/passwordchange')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookies])
        .send(clientInfo);

      expect(res.body).toEqual(expRes);
    });

    test('Should log user in with new password', async () => {
      const loginRes = { app: { isLoggedIn: true } };
      const clientInfo = {
        data: {
          ...loginInfo.data,
          password: newPassword,
        },
      };

      console.log('Client Info: ', clientInfo);

      const res = await agent
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(clientInfo);

      expect(res.body).toEqual(loginRes);
      cookies = res.headers['set-cookie'].pop().split(';')[0];
    });

    test('Password should not be updated given wrong old password', async () => {
      const expRes = {
        app: {
          error: {
            errorFields: [
              {
                field: 'oldpassword',
                message: 'Password supplied is incorrect',
              },
            ],
            type: 'inputerror',
          },
        },
      };

      const clientInfo = {
        data: { oldPassword: 'wrongpassword', newPassword },
      };

      const res = await agent
        .post('/api/profile/passwordchange')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('Cookie', [cookies])
        .send(clientInfo);

      expect(res.body).toEqual(expRes);
    });

    test('Should not log user in with old password', async () => {
      const expRes = {
        app: {
          error: {
            errorFields: [
              {
                field: 'password',
                message: 'User password incorrect',
              },
            ],
            type: 'inputerror',
          },
        },
      };

      const res = await agent
        .post('/login')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(loginInfo);

      expect(res.body).toEqual(expRes);
    });
  });

  // test for deleting user account
  describe('Tests for deleting user account', () => {
    beforeAll(async () => {
      await clearUsersCollection();
      const info = await insertToDB();
      userInfo = info;
    });

    test('User account should be deleted', async () => {
      const expRes = {
        app: { isLoggedIn: false },
        flags: { isDeleted: { value: true } },
      };

      const res = await agent
        .post('/api/profile/delete')
        .set('Accept', 'application/json')
        .set('Cookie', [cookies]);

      // test if session was destroyed
      expect(res.body.app).toEqual(expRes.app);
      expect(res.body.flags).toEqual(expRes.flags);
    });
  });
});
