import app from '../../server.js';
import request from 'supertest';
import { cleanupDB, insertToDB } from './Test Handlers/testHandlers.js';

let userInfo;

beforeAll(async () => {
  const info = await insertToDB();
  userInfo = info;
});

afterAll(async () => {
  // Delete the dummy data (Create a util function for this for reusability in other tests)
  await cleanupDB();
});

describe('GET /login', () => {
  const loginRes = { app: { isLoggedIn: true } };
  const loginInfo = {
    data: {
      username: 'linda',
      password: 'linda',
    },
  };

  test('Should login user with proper response', async () => {
    const res = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(loginInfo);

    // console.log('Response: ', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(loginRes);
    expect(res.type).toBe('application/json');
  });

  test('Should not login with wrong username', async () => {});
  test('Should not login with wrong password', async () => {});
  test('Should have one session on login', async () => {});
});
