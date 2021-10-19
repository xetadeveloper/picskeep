import app from '../../server.js';
import request from 'supertest';
import { cleanupDB, insertToDB } from './Test Handlers/testHandlers.js';
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

beforeAll(async () => {
  const info = await insertToDB();
  userInfo = info;
});

afterAll(async () => {
  // Delete the dummy data (Create a util function for this for reusability in other tests)
  await cleanupDB();
});

// Testing retrieval of user information
describe('GET /api/getUserInfo', () => {
  const loginRes = { app: { isLoggedIn: true } };

  test('Should login user properly', async () => {
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

  test('Should return dummyUser data', async () => {
    const appResData = plainDummyUsers[0];
    delete appResData.password;

    const expectedRes = { app: { userInfo: appResData } };
    const res = await agent
      .get('/api/getUserInfo')
      .set('Accept', 'application/json')
      .set('Cookie', [cookies])
      .expect(res => {
        delete res.body.app.userInfo._id;
      });

    expect(res.body).toEqual(expectedRes);
    expect(res.body.app.userInfo.password).toBeUndefined();
    expect(res.body.app.userInfo._id).toBeUndefined();
  }, 100000);
});
