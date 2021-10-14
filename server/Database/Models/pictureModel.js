import { removeNull } from '../../Utils/utility.js';
import mongoTypes from 'mongodb';
const { Double } = mongoTypes;

export default class Picture {
  constructor(picture) {
    this.url = '';
    this.size = 0;
    this.picID = '';
    this.fileName = '';

    if (picture) {
      Object.assign(this, picture);
    }
  }

  removeEmptyFields() {
    return removeNull.call(this);
  }

  convertToMongo() {
    const mongoTypes = {
      url: this.url,
      size: this.size ? Double(this.size) : null,
      picID: this.picID,
      fileName: this.fileName,
    };

    for (let prop in mongoTypes) {
      if (
        !mongoTypes[prop] ||
        (typeof mongoTypes[prop] === 'object' &&
          Object.keys(mongoTypes[prop]).indexOf('value') > -1 &&
          !mongoTypes[prop].value)
      ) {
        delete mongoTypes[prop];
      }
    }

    return mongoTypes;
  }
}
