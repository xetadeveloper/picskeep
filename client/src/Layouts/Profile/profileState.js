export const initialState = {
  formData: {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  editMode: false,
  isOps: false,
  modalState: { show: false },
};

export function profileReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case 'updateInput':
      return {
        ...state,
        formData: { ...state.formData, ...payload },
      };

    case 'setinitialform':
    //   console.log('User Info Payload: ', payload);
      if (payload && Object.entries(payload).length) {
        return {
          ...state,
          formData: { ...state.formData, ...payload },
        };
      } else {
        return state;
      }

    case 'editMode':
      return {
        ...state,
        editMode: payload,
      };

    case 'updateModal':
      return {
        ...state,
        modalState: payload,
      };

    case 'setOps':
      return {
        ...state,
        isOps: payload,
      };

    default:
      return state;
  }
}
