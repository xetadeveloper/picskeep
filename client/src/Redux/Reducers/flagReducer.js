import {
  UPDATE_FLAG_STATE,
} from '../ActionTypes/flagsActionTypes';

const initialState = {
  isUpdated: { value: false },
  isDeleted: { value: false },
  isCreated: { value: true },
};

export default function flagReducer(state = initialState, action) {
  const { type, payload } = action;

  // Create switch here
  switch (type) {
    case UPDATE_FLAG_STATE:
      return { ...state, ...payload };

    default:
      return state;
  }
}
