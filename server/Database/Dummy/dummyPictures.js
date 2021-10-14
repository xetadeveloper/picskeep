import { v4 as genUUID } from 'uuid';
import mongoTypes from 'mongodb';
import Picture from '../Models/pictureModel.js';

const { Double } = mongoTypes;

export const dummyPictures = [
  {
    picID: 'picid1',
    url: 'url124',
    size: 2000,
    fileName: 'pic1.jpg',
  },
  {
    picID: 'picid2',
    url: 'url905',
    size: 4000,
    fileName: 'pic2.jpg',
  },
  {
    picID: 'picid3',
    url: 'url2843',
    size: 600,
    fileName: 'fancyPic.jpg',
  },
  {
    picID: 'picid4',
    url: 'url4594',
    size: 5000,
    fileName: 'userPic.jfif',
  },
  {
    picID: 'pici55',
    url: 'url04893',
    size: 8000,
    fileName: 'semPic.png',
  },
];

export const mongoDummyPictures = dummyPictures.map(picture =>
  new Picture(picture).removeEmptyFields().convertToMongo()
);
