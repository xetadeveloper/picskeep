import app from '../../server.js';
import { jest } from '@jest/globals';
import request from 'supertest';
import * as middleware from '../../Middleware/middleware.js';
import { cleanupDB, insertToDB } from './Test Handlers/testHandlers.js';
import { plainDummyUsers } from '../../Database/Dummy/dummyUsers.js';

let userInfo;
const agent = request(app);

jest.mock('../../Middleware/middleware.js');

const isLoggedIn = middleware.isLoggedIn;

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
  test('Should return dummyUser data', async () => {
    isLoggedIn.mockImplementation((req, res, next) => {
      next();
    });
    
    const appResData = plainDummyUsers[0];
    delete appResData.password;

    const expectedRes = { app: { userInfo: appResData } };
    const res = await agent
      .get('/api/getUserInfo')
      .set('Accept', 'application/json');

    expect(isLoggedIn).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual(expectedRes);
    expect(res.body.app.userInfo.password).toBeUndefined();
    expect(res.body.app.userInfo._id).toBeUndefined();
  }, 100000);
});
