import { FETCH_STATUS } from "../ActionTypes/appActionTypes";

export function setFetchStatus(payload) {
  return {
    type: FETCH_STATUS,
    payload,
  };
}
