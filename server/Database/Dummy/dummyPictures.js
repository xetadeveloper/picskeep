import { v4 as genUUID } from 'uuid';
import mongoTypes from 'mongodb';
import Picture from '../Models/pictureModel.js';

const { Double } = mongoTypes;

export const dummyPictures = [
  {
    picID: 'picid1',
    fileName: 'linda/picture/pic1.jpg',
  },
  {
    picID: 'picid2',
    fileName: 'linda/picture/pic2.jpg',
  },
  {
    picID: 'picid3',
    fileName: 'linda/picture/fancyPic.jpg',
  },
  {
    picID: 'picid4',
    fileName: 'linda/picture/userPic.jfif',
  },
  {
    picID: 'pici55',
    fileName: 'linda/picture/semPic.png',
  },
];

export const mongoDummyPictures = dummyPictures.map(picture =>
  new Picture(picture).removeEmptyFields().convertToMongo()
);
