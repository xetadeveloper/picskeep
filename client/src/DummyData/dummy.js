import pic1 from '../Images/pic1.jpg';
import pic2 from '../Images/pic2.jpg';
import pic3 from '../Images/pic3.jpg';
import pic4 from '../Images/pic4.jpg';
import pic5 from '../Images/pic5.jpeg';
import pic6 from '../Images/pic6.jpg';

export const dummyPictures = [
  {
    fileID: 'idwhatever1',
    name: 'picturethatissolong',
    type: 'picture',
    url: 'C:\\Users\\Fego\\Documents\\Web Project\\MERN APPS\\PicsKeep\\client\\src\\Images\\pic1.jpg',
    pic: pic1,
  },
  {
    fileID: 'idwhatever2',
    name: 'pic2',
    type: 'picture',
    url: 'C:\\Users\\Fego\\Documents\\Web Project\\MERN APPS\\PicsKeep\\client\\src\\Images\\pic2.jpg',
    pic: pic2,
  },
  {
    fileID: 'idwhatever3',
    name: 'pic3',
    type: 'picture',
    url: '../Images/pic3.jpg',
    pic: pic3,
  },
  {
    fileID: 'idwhatever4',
    name: 'pic3',
    type: 'picture',
    url: 'C:\\Users\\Fego\\Documents\\Web Project\\MERN APPS\\PicsKeep\\client\\src\\Images\\pic4.jpg',
    pic: pic4,
  },
  {
    fileID: 'idwhatever5',
    name: 'pic3',
    type: 'picture',
    url: 'C:\\Users\\Fego\\Documents\\Web Project\\MERN APPS\\PicsKeep\\client\\src\\Images\\pic5.jpg',
    pic: pic5,
  },
  {
    fileID: 'idwhatever6',
    name: 'pic3',
    type: 'picture',
    url: 'C:\\Users\\Fego\\Documents\\Web Project\\MERN APPS\\PicsKeep\\client\\src\\Images\\pic6.jpg',
    pic: pic6,
  },
];

export const dummyFolders = [
  {
    fileID: 'idwhatever1',
    name: 'fold1',
    type: 'folder',
    pictures: dummyPictures.slice(0, 6),
  },
  {
    fileID: 'idwhatever2',
    name: 'fold2',
    type: 'folder',
    pictures: dummyPictures.slice(0, 4),
  },
  { fileID: 'idwhatever3', name: 'fold3', type: 'folder' },
  {
    fileID: 'idwhatever4',
    name: 'fold3',
    type: 'folder',
    pictures: dummyPictures.slice(0, 2),
  },
  { fileID: 'idwhatever5', name: 'Family Pictures', type: 'folder' },
  { fileID: 'idwhatever6', name: 'folder too long to name', type: 'folder' },
  { fileID: 'idwhatever7', name: 'fold3', type: 'folder' },
  { fileID: 'idwhatever8', name: 'fold3', type: 'folder' },
  { fileID: 'idwhatever9', name: 'fold3', type: 'folder' },
  { fileID: 'idwhatever10', name: 'fold3', type: 'folder' },
  { fileID: 'idwhatever11', name: 'fold3', type: 'folder' },
  { fileID: 'idwhatever12', name: 'pic2', type: 'folder' },
];

export const dummySearchList = [...dummyPictures, ...dummyFolders];
