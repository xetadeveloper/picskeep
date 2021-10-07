/** To remove null or undefined values from an object */
export function removeNull(obj) {
  for (let property in obj) {
    if (!obj[property]) {
      delete obj[property];
    }
  }
  return obj;
}

export function convertCamelCase(text) {
  const arr = text.split('');
  arr[0] = String.fromCharCode(arr[0].charCodeAt(0) ^ 32);
  return arr.join('');
}

