const dummyData = {};

const pictures = {
  name: 'pictures',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
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
        type: {
          bsonType: 'string',
        },
      },
    },
  },
};

export default pictures;
