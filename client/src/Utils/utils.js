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

/** Fetches the presigned GET URL from the server
 * @param {String} s3Key the key of the picture on S3
 * @returns url of file on S3
 */
export async function getPresignedUrl(s3Key) {
  let response;
  try {
    response = await fetch('/api/getSignedUrl', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          s3Key,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      cache: 'default',
    });

    if (response.status === 200) {
      const data = await response.json();

      return { data, status: response.status };
    } else {
      return {
        status: response.status,
        error: `Bad response: ${response.statusText}. Contact support`,
      };
    }
  } catch (error) {
    return { status: response.status, error };
  }
}

/** Fetches the presigned PUT URL from the server
 * @param {String} s3Key the key of the picture on S3
 * @returns url of file on S3
 */
export async function putPresignedUrl(fileName) {
  let response;
  try {
    response = await fetch('/api/putSignedUrl', {
      method: 'POST',
      body: JSON.stringify({ data: { fileName } }),
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      cache: 'default',
    });

    if (response.status === 200) {
      const data = await response.json();

      return { data, status: response.status };
    } else {
      return {
        status: response.status,
        error: `Bad response: ${response.statusText}. Contact support`,
      };
    }
  } catch (error) {
    return { status: response.status, error };
  }
}

/** Retreives an image from the server
 *
 * @param {String} url the url where the image is stored
 * @returns A blob from the server
 */
export async function getImage(url) {
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      cache: 'default',
    });

    if (response.status === 200) {
      const blob = await response.blob();
      return { image: blob, status: response.status };
    } else {
      return {
        status: response.status,
        error: `Bad response: ${response.statusText}. Contact support`,
      };
    }
  } catch (error) {
    return { status: response.status, error };
  }
}

/** Retreives an image from the server
 *
 * @param {String} url the url where the image is stored
 * @returns A blob from the server
 */
export async function putImage(url, image) {
  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      cache: 'default',
      body: image,
    });

    console.log('Put Response: ', response);
    if (response.status === 200) {
      return { status: response.status };
    } else {
      return {
        status: response.status,
        error: `Bad response: ${response.statusText}. Contact support`,
      };
    }
  } catch (error) {
    return { status: response.status, error };
  }
}
