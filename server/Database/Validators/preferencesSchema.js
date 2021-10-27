const dummyData = {};

const preferencesSchema = {
  name: 'preferences',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        saveSession: { 
          bsonType: 'bool',
        },
      },
    },
  },
};

export default preferencesSchema;
