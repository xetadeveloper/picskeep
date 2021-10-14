const dummyData = {};

const folders = {
  name: 'folders',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['folderID', 'folderName'],
      properties: {
        folderID: {
          bsonType: 'string',
        },
        folderName: {
          bsonType: 'string',
        },
        folderPictures: {
          bsonType: 'array',
          // items: { ...pictureSchema.validator.$jsonSchema },
        },
      },
    },
  },
};

export default folders;
