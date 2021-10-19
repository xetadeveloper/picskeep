const dummyData = {};

const pictures = {
  name: 'pictures',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['picID', 'fileName'],
      properties: {
        picID: {
          bsonType: 'string',
        },
        fileName: {
          bsonType: 'string',
        },
      },
    },
  },
};

export default pictures;
