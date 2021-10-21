const dummyData = {};

const profilePicSchema = {
  name: 'preferences',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['fileName, s3Key'],
      properties: {
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

export default profilePicSchema;
