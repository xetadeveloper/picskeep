import {
  RESET_FLAG_STATE,
  UPDATE_FLAG_STATE,
  UPLOAD_STATUS,
} from '../ActionTypes/flagsActionTypes';

const initialState = {
  isUpdated: { value: false },
  isDeleted: { value: false },
  isCreated: { value: false },
  isUploading: false,
};

export default function flagReducer(state = initialState, action) {
  const { type, payload } = action;

  // Create switch here
  switch (type) {
    case UPDATE_FLAG_STATE:
      return { ...state, ...payload };

    case RESET_FLAG_STATE:
      return { ...state, ...initialState };

    case UPLOAD_STATUS:
      return { ...state, isUploading: payload };

    default:
      return state;
  }
}
