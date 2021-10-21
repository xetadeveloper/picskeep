import app from '../../server.js';
import request from 'supertest';
import { cleanupDB, insertToDB } from './Test Handlers/testHandlers.js';

let userInfo;
const agent = request(app);
const loginRes = { app: { isLoggedIn: true } };

beforeAll(async () => {
  const info = await insertToDB();
  userInfo = info;
});

afterAll(async () => {
  // Delete the dummy data (Create a util function for this for reusability in other tests)
  await cleanupDB(true);
});

describe('Static Routes Tests', () => {
  describe('Tests for signup route', () => {
    const signUpInfo = {
      username: 'gong',
      password: 'gong',
      email: 'gong@mail.com',
      firstName: 'Gong',
      lastName: 'Huen',
    };

    test('Should sign up user', async () => {
      const res = await agent
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send({ data: signUpInfo })
        .expect(201);
    });

    test('Should login signed up user ', async () => {
      const loginInfo = {
        username: signUpInfo.username,
        password: signUpInfo.password,
        saveSession: false,
      };

      const res = await agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send({ data: loginInfo });

      // console.log('Response: ', res.body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(loginRes);
      expect(res.type).toBe('application/json');
    });

    test('Should not sign up existing user', async () => {
      const expRes = {
        app: {
          error: {
            type: 'inputerror',
            errorFields: [
              { field: 'username', message: 'Username may already be taken' },
              {
                field: 'email',
                message: 'This email may have been used already',
              },
            ],
          },
        },
      };

      const res = await agent
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send({ data: signUpInfo });

      expect(res.body).toEqual(expRes);
    });

    test('Should not sign up user with existing username', async () => {
      const expRes = {
        app: {
          error: {
            type: 'inputerror',
            errorFields: [
              { field: 'username', message: 'Username may already be taken' },
            ],
          },
        },
      };

      const res = await agent
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send({ data: { ...signUpInfo, email: 'uniqueemail@mail.com' } });

      expect(res.body).toEqual(expRes);
    });

    test('Should not sign up user with existing email', async () => {
      const expRes = {
        app: {
          error: {
            type: 'inputerror',
            errorFields: [
              {
                field: 'email',
                message: 'This email may have been used already',
              },
            ],
          },
        },
      };

      const res = await agent
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send({ data: { ...signUpInfo, username: 'shaolin' } });

      expect(res.body).toEqual(expRes);
    });
  });

  describe('Tests for login route', () => {
    const loginInfo = {
      data: {
        username: 'linda',
        password: 'linda',
        saveSession: false,
      },
    };

    test('Should login user with proper response', async () => {
      const res = await agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(loginInfo);

      // console.log('Response: ', res.body);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(loginRes);
      expect(res.type).toBe('application/json');
    });

    test('Should not login with wrong username', async () => {
      const localInfo = { data: { ...loginInfo, username: 'maxwell' } };
      const expRes = {
        app: {
          error: {
            type: 'inputerror',
            errorFields: [
              {
                field: 'username',
                message: `User with username ${localInfo.data.username} does not exist`,
              },
            ],
          },
        },
      };

      const res = await agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(localInfo);

      // console.log('Response: ', res.body);
      expect(res.status).toBe(400);
      expect(res.body).toEqual(expRes);
      expect(res.type).toBe('application/json');
    });

    test('Should not login with wrong password', async () => {
      const localInfo = { data: { ...loginInfo.data, password: 'maxwell' } };
      console.log('Local info: ', localInfo);
      const expRes = {
        app: {
          error: {
            type: 'inputerror',
            errorFields: [
              { field: 'password', message: 'User password incorrect' },
            ],
          },
        },
      };

      const res = await agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(localInfo);

      // console.log('Response: ', res.body);
      expect(res.status).toBe(400);
      expect(res.body).toEqual(expRes);
      expect(res.type).toBe('application/json');
    });

    test('Should have one session on login', async () => {
      const res = await agent
        .post('/login')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(loginInfo);

      // console.log('Response: ', res.body);
      // expect(res.status).toBe(200);
      // expect(res.body).toEqual(loginRes);
      // expect(res.type).toBe('application/json');
    });
  });
});
