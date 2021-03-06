import { removeNull } from '../../Utils/utility.js';
import { v4 } from 'uuid';

export default class Picture {
  constructor(picture) {
    this.picID = '';
    this.fileName = '';
    this.s3Key = '';
    this.type = 'picture';

    if (picture) {
      Object.assign(this, picture);
    }
  }

  removeEmptyFields() {
    return removeNull.call(this);
  }

  createS3Key(path) {
    this.s3Key = `${path}/${this.fileName}`;
    return this;
  }

  createID() {
    this.picID = v4();
    return this;
  }

  convertToMongo() {
    const mongoTypes = {
      picID: this.picID,
      fileName: this.fileName,
      s3Key: this.s3Key,
      type: this.type,
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
