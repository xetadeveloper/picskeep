import {
  CREATE_PIC,
  DELETE_ACCOUNT,
  DELETE_PIC,
  GET_FAILED,
  GET_INFO,
  GET_SUCCESSFUL,
  GET_URL,
  POST_FAILED,
  POST_SUCCESSFUL,
  PUT_URLS,
  RESTORE_SESSION,
  UPDATE_PASSWORD,
  UPDATE_PIC,
  UPDATE_PROFILE,
} from '../ActionTypes/httpActionTypes';

function addFetchOptions(payload, url) {
  payload.url = url;
  payload.httpMiddleware = true;
  if (payload.method.toLowerCase() !== 'get') {
    payload.headers = {
      'Content-Type': 'application/json',
    };
  }
}

// Http Actions
export function restoreSession() {
  return {
    type: RESTORE_SESSION,
    payload: { url: '/restoreSession', httpMiddleware: true, method: 'GET' },
  };
}

export function getUserInfo() {
  return {
    type: GET_INFO,
    payload: { url: '/api/getUserInfo', httpMiddleware: true, method: 'GET' },
  };
}

export function postSuccessful(payload) {
  return {
    type: POST_SUCCESSFUL,
    payload,
  };
}

export function postFailed(payload) {
  return {
    type: POST_FAILED,
    payload,
  };
}

export function getFailed(payload) {
  return {
    type: GET_FAILED,
    payload,
  };
}
export function getSuccessful(payload) {
  return {
    type: GET_SUCCESSFUL,
    payload,
  };
}

// ============= Picture Actions ============
export function deletePicture(payload) {
  if (payload) {
    payload.url = '/api/picture/delete';
    payload.httpMiddleware = true;
  }

  return {
    type: DELETE_PIC,
    payload,
  };
}

export function createPictures(payload) {
  // console.log('sending multiple pictures to DB');
  if (payload) {
    payload.url = '/api/picture/createMany';
    payload.httpMiddleware = true;
  }

  return {
    type: CREATE_PIC,
    payload,
  };
}

export function updatePicture(payload) {
  if (payload) {
    payload.url = '/api/picture/update';
    payload.httpMiddleware = true;
  }

  return {
    type: UPDATE_PIC,
    payload,
  };
}

export function getPutUrls(payload) {
  if (payload) {
    payload.url = '/api/putMultipleSignedUrls';
    payload.httpMiddleware = true;
  }

  return {
    type: PUT_URLS,
    payload,
  };
}

// ============= Profile Actions ============
export function deleteAccount(payload) {
  if (payload) {
    payload.url = '/api/profile/delete';
    payload.httpMiddleware = true;
  }

  return {
    type: DELETE_ACCOUNT,
    payload,
  };
}

export function updateProfile(payload) {
  if (payload) {
    payload.url = '/api/profile/update';
    payload.httpMiddleware = true;
  }

  return {
    type: UPDATE_PROFILE,
    payload,
  };
}

export function updatePassword(payload) {
  if (payload) {
    payload.url = '/api/profile/passwordchange';
    payload.httpMiddleware = true;
  }

  return {
    type: UPDATE_PASSWORD,
    payload,
  };
}
