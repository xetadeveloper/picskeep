import app from '../../server.js';
import request from 'supertest';
import { cleanupDB, insertToDB } from './Test Handlers/testHandlers.js';
import { plainDummyUsers } from '../../Database/Dummy/dummyUsers.js';

let userInfo;
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

describe('GET /api/getUserInfo', () => {
  const loginRes = { app: { isLoggedIn: true } };

  test('Should login to database ', async () => {
    const res = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send(loginInfo);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(loginRes);
    expect(res.type).toBe('application/json');
  });

  test('Should return dummyUser data', async () => {
    // Find out how to send the session info with the request
    const res = await request(app)
      .get('/api/getUserInfo')
      .set('Accept', 'application/json')
      .expect(res => {
        delete res.body._id;
      });

    // console.log('Database User info: ', userInfo);

    expect(res.body).toEqual(plainDummyUsers[0]);
    return;
  }, 100000);
});
