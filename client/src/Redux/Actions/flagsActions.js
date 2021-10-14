import { UPDATE_FLAG_STATE } from '../ActionTypes/flagsActionTypes';

export function updateFlagState(payload) {
  return {
    type: UPDATE_FLAG_STATE,
    payload,
  };
}
