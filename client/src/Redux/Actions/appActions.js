import {
  FETCH_STATUS,
  S3_UPLOAD,
  SHOW_ERROR,
  UPDATE_APP_STATE,
} from '../ActionTypes/appActionTypes';

export function setIsFetching(payload) {
  return {
    type: FETCH_STATUS,
    payload,
  };
}

export function showError(payload) {
  // console.log('show error payload: ', payload);

  return {
    type: SHOW_ERROR,
    payload,
  };
}

export function updateAppState(payload) {
  // console.log('app payload: ', payload);

  return {
    type: UPDATE_APP_STATE,
    payload,
  };
}

export function s3Upload(payload) {
  console.log('S3 payload: ', payload);

  if (payload) {
    payload.s3Middleware = true;
  }

  return {
    type: S3_UPLOAD,
    payload,
  };
}
