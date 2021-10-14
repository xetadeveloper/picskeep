import {
  SHOW_ERROR,
  UPDATE_APP_STATE,
  FETCH_STATUS,
} from '../ActionTypes/appActionTypes';
import {
  GET_FAILED,
  GET_SUCCESSFUL,
  POST_FAILED,
  POST_SUCCESSFUL,
} from '../ActionTypes/httpActionTypes';

const initialState = {
  error: null,
  isLoggedIn: false,
  userInfo: {},
  isFetching: false,
};

export default function appReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_SUCCESSFUL:
    case POST_SUCCESSFUL:
    case GET_FAILED:
    case POST_FAILED:
    case UPDATE_APP_STATE:
      return { ...state, ...payload };
    case SHOW_ERROR:
      return { ...state, error: { ...payload } };
    case FETCH_STATUS:
      return { ...state, isFetching: payload };

    default:
      return state;
  }
}
