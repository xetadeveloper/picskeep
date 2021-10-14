import {
    GET_FAILED,
    GET_SUCCESSFUL,
    POST_FAILED,
    POST_SUCCESSFUL,
    RESTORE_SESSION,
  } from "../ActionTypes/httpActionTypes";
  
  // Http Actions
  export function restoreSession(payload) {
    if (payload) {
      payload.url = "/api/restoreSession";
    }
  
    return {
      type: RESTORE_SESSION,
      payload,
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
  
  
  