import {
  RESET_FLAG_STATE,
  UPDATE_FLAG_STATE,
  UPLOAD_STATUS,
} from '../ActionTypes/flagsActionTypes';

export function updateFlagState(payload) {
  return {
    type: UPDATE_FLAG_STATE,
    payload,
  };
}

export function resetFlagState() {
  return {
    type: RESET_FLAG_STATE,
  };
}

export function setIsUploading(payload) {
  return {
    type: UPLOAD_STATUS,
    payload,
  };
}
