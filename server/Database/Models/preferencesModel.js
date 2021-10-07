export default class Preferences {
  constructor(pref) {
    this.saveSession = false;

    if (pref) {
      Object.assign(this, pref);
    }
  }
}
