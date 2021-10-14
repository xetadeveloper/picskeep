const dummyData = {};

const pictures = {
  name: 'pictures',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['picID','url', 'fileName'],
      properties: {
        picID: {
          bsonType: 'string',
        },
        url: {
          bsonType: 'string',
        },
        fileName: {
          bsonType: 'string',
        },
        size: {
          bsonType: 'double',
        },
      },
    },
  },
};

export default pictures;
