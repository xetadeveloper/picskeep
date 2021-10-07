import bcrypt from 'bcrypt';

export default class User {
  constructor(user) {
    this.username = '';
    this.password = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.storageUsed = '';

    if (user) {
      Object.assign(this, ...user);
    }
  }

  async hashPassword() {
    const SALT_ROUNDS = 10;

    try {
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
      return this;
    } catch (err) {
      console.log('Error Occured In Hashing User Password: ', err.stack);
      throw err;
    }
  }

  convertToMongo() {}
}
