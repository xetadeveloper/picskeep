const dummyData = {};

const preferencesSchema = {
  name: 'preferences',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['saveSession'],
      properties: {
        saveSession: { 
          bsonType: 'bool',
        },
      },
    },
  },
};

export default preferencesSchema;
