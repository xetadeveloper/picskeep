import { removeNull } from '../../Utils/utility';

export default class Preferences {
  constructor(pref) {
    this.saveSession = false;

    if (pref) {
      Object.assign(this, pref);
    }
  }

  removeEmptyFields() {
    return removeNull.call(this);
  }
}
