import User from '../Models/userModel.js';
import { dummyPictures, mongoDummyPictures } from './dummyPictures.js';
import dummyPref from './dummyPref.js';

export const dummyUsers = [
  {
    // _id: 'id1',
    username: 'linda',
    password: 'linda',
    firstName: 'Linda',
    lastName: 'Powell',
    email: 'linda@gmail.com',
    storageUsed: 3000,
  },
];

export const plainDummyUsers = [
  { ...dummyUsers, pictures: dummyPictures, preferences: dummyPref },
];

const mongoUsers = await Promise.all(
  dummyUsers.map(async user => {
    const hashedUser = await new User(user).hashPassword();
    const mongoUser = hashedUser.removeEmptyFields().convertToMongo();
    return mongoUser;
  })
);

export const mongoDummyUsers = [
  { ...mongoUsers[0], pictures: mongoDummyPictures, preferences: dummyPref },
];
