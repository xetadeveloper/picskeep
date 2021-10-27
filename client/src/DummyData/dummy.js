export const dummyPictures = [
  {
    picID: 'idwhatever1',
    fileName: 'picturethatissolong',
    type: 'picture',
    s3Key: '',
  },
  {
    picID: 'idwhatever2',
    fileName: 'pic2',
    type: 'picture',
    s3Key: '',
  },
  {
    picID: 'idwhatever3',
    fileName: 'pic3',
    type: 'picture',
    s3Key: '',
  },
  {
    picID: 'idwhatever4',
    fileName: 'pic3',
    type: 'picture',
    s3Key: '',
  },
  {
    picID: 'idwhatever5',
    fileName: 'pic3',
    type: 'picture',
    s3Key: '',
  },
  {
    picID: 'idwhatever6',
    fileName: 'pic3',
    type: 'picture',
    s3Key: '',
  },
];

export const dummyFolders = [
  {
    folderID: 'idwhatever1',
    fileName: 'fold1',
    type: 'folder',
    pictures: dummyPictures.slice(0, 6),
  },
  {
    folderID: 'idwhatever2',
    fileName: 'fold2',
    type: 'folder',
    pictures: dummyPictures.slice(0, 4),
  },
  { folderID: 'idwhatever3', fileName: 'fold3', type: 'folder' },
  {
    folderID: 'idwhatever4',
    fileName: 'fold3',
    type: 'folder',
    pictures: dummyPictures.slice(0, 2),
  },
  { folderID: 'idwhatever5', fileName: 'Family Pictures', type: 'folder' },
  {
    folderID: 'idwhatever6',
    fileName: 'folder too long to name',
    type: 'folder',
  },
  { folderID: 'idwhatever7', fileName: 'fold3', type: 'folder' },
  { folderID: 'idwhatever8', fileName: 'fold3', type: 'folder' },
  { folderID: 'idwhatever9', fileName: 'fold3', type: 'folder' },
  { folderID: 'idwhatever10', fileName: 'fold3', type: 'folder' },
  { folderID: 'idwhatever11', fileName: 'fold3', type: 'folder' },
  { folderID: 'idwhatever12', fileName: 'pic2', type: 'folder' },
];

export const dummySearchList = [...dummyPictures, ...dummyFolders];
