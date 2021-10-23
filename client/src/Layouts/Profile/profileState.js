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
  selectedPic: null,
  userPic: null,
  processOn: false,
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

    case 'editModeOff':
      return {
        ...state,
        editMode: false,
        selectedPic: null,
        userPic: null,
      };

    case 'setProcessOn':
      return {
        ...state,
        processOn: true,
      };

    case 'setProcessComplete':
      return {
        ...state,
        processOn: false,
        editMode: false,
        userPic: null,
        selectedPic: null,
      };

    case 'setProcessOff':
      return {
        ...state,
        processOn: false,
      };

    case 'selectPic':
      return {
        ...state,
        selectedPic: payload,
        userPic: URL.createObjectURL(payload),
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

    case 'setUserPic':
      return {
        ...state,
        userPic: payload,
      };

    default:
      return state;
  }
}
