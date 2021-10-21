// Schema Imports
import folderSchema from './folderSchema.js';
import pictureSchema from './pictureSchema.js';
import preferencesSchema from './preferencesSchema.js';
import profilePicSchema from './profilePicSchema.js';

// Use the models to create dummy data
const dummyData = {};

const usersSchema = {
  name: 'users',
  dummyData,
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['username', 'password', 'firstName', 'lastName', 'email'],
      properties: {
        username: {
          bsonType: 'string',
        },
        password: {
          bsonType: 'string',
        },
        firstName: {
          bsonType: 'string',
        },
        lastName: {
          bsonType: 'string',
        },
        email: {
          bsonType: 'string',
        },
        storageUsed: {
          bsonType: 'double',
        },
        pictures: {
          bsonType: 'array',
          items: { ...pictureSchema.validator.$jsonSchema },
        },
        profilePic: { ...profilePicSchema.validator.$jsonSchema },
        preferences: { ...preferencesSchema.validator.$jsonSchema },

        // folders: {
        //   bsonType: 'array',
        //   items: { ...folderSchema.validator.$jsonSchema },
        // },
      },
    },
  },
};

export default usersSchema;
