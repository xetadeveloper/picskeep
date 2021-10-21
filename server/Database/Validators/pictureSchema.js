const dummyData = {};

const pictures = {
  name: 'pictures',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['picID', 'fileName', 's3Key'],
      properties: {
        picID: {
          bsonType: 'string',
        },
        fileName: {
          bsonType: 'string',
        },
        s3Key: {
          bsonType: 'string',
        },
      },
    },
  },
};

export default pictures;
