export default class Picture {
  constructor(picture) {
    this.url = '';
    this.size = 0;

    if (picture) {
      Object.assign(this, picture);
    }
  }
}
