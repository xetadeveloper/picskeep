/** To remove null or undefined values from an object */
export function removeNull(clearAll) {
  for (let property in this) {
    if (!this[property]) {
      // if primitive falsy value
      delete this[property];
    } else if (clearAll) {
      // If empty objects and arrays are to be removed too
      if (typeof this[property] === 'array' && !this[property].length) {
        // If empty array
        delete this[property];
      } else if (
        typeof this[property] === 'object' &&
        !Object.entries(this[property]).length
      ) {
        // If empty object
        delete this[property];
      }
    }
  }
  return this;
}

/** Appends the correct property name to object for mongodb updates
 * @param {String} prePropName the string that should start before the field name for the query
 */
export function appendPropertyName(obj, prePropName) {
  for (let property in obj) {
    if (obj[property] === false || obj[property]) {
      obj[`${prePropName}.${property}`] = obj[property];

      delete obj[property];
    } else {
      delete obj[property];
    }
  }
  return obj;
}

/** Constructs response for this particular application. The constructor was
 * built based on the response requirements from the client
 * @param {ResponseObject} res response object
 * @param {Number} status response status
 * @param {Object} app app state object
 * @param {Object} flags flags state object
 */
export function sendJSONRes(res, status, app, flags) {
  res.status(status).json({
    app,
    flags,
  });
}
