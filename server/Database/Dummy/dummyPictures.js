import Picture from '../Models/pictureModel.js';

const username = 'linda';

export const dummyPictures = [
  {
    picID: 'picid1',
    fileName: 'userfile.jpg',
    s3Key: `${username}/picture/userfile.jpg`,
  },
  {
    picID: 'picid2',
    fileName: 'pic2.jpg',
    s3Key: `${username}/picture/pic2.jpg`,
  },
  {
    picID: 'picid3',
    fileName: 'fancyPic.jpg',
    s3Key: `${username}/picture/fancyPic.jpg`,
  },
  {
    picID: 'picid4',
    fileName: 'userPic.jfif',
    s3Key: `${username}/picture/userPic.jfif`,
  },
  {
    picID: 'pici55',
    fileName: 'semPic.png',
    s3Key: `${username}/picture/semPic.png`,
  },
];

export const mongoDummyPictures = dummyPictures.map(picture =>
  new Picture(picture).removeEmptyFields().convertToMongo()
);
