// Modules
import React, { useEffect, useReducer, useRef } from 'react';
import { profileReducer, initialState } from './profileState';
import { connect } from 'react-redux';

// Redux
import { deleteAccount, updateProfile } from '../../Redux/Actions/httpActions';

// Styles
import style from './profile.module.css';

// Components
import PagePrompt from '../../Components/PagePrompt/pagePrompt';
import { FiCamera, FiLoader } from 'react-icons/fi';
import Modal from '../../Components/Modals/modal';
import defaultUserPic from '../../Images/user icon.png';
import ScrollTop from '../../Components/ScrollTop/scrollTop';
import PageHeader from '../../Components/PageHeaderEdit/pageHeaderEdit';
import {
  getImage,
  getPresignedUrl,
  putImage,
  putPresignedUrl,
} from '../../Utils/utils';
import {
  useFlags,
  useResetFlags,
  useShowError,
} from '../../Custom Hooks/customHooks';
import { FaSpinner } from 'react-icons/fa';
import { errorTypes } from '../../config';

function Profile({ userInfo, deleteUser, updateUser }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const { profilePic } = userInfo || {};

  const showError = useShowError();

  const { formData, editMode, modalState, selectedPic } = state;
  const { userPic, processOn } = state;
  const fileRef = useRef();
  const resetFlags = useResetFlags();
  const { isUpdated, isDeleted } = useFlags();
  // // console.log('FormData: ', formData);

  // // console.log('User Pic: ', userPic);

  // Sets the value of the form from userInfo
  useEffect(() => {
    // // console.log('Running Effect');
    dispatch({ type: 'setinitialform', payload: userInfo });
  }, [userInfo]);

  // Handles successful update
  useEffect(() => {
    if (isUpdated.value) {
      // console.log('Profile Update Successful');

      // When update is finished
      dispatch({ type: 'setProcessComplete' });
    }
  }, [isUpdated]);

  // To reset flag state on component unmount
  useEffect(() => {
    return () => {
      resetFlags();
    };
  }, []);

  // Renders the initial profile picture
  useEffect(() => {
    if (!userPic) {
      setInitialImgSrc();
    }
  }, [userPic]);

  // Handles input change
  function handleChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    dispatch({ type: 'updateInput', payload: { [name]: value } });
  }

  /** Updates the profile*/
  async function updateProfile() {
    dispatch({ type: 'setProcessOn' });

    // first call for put presigned url if profile picture was changed
    if (selectedPic) {
      // Upload picture to s3
      const info = await putPresignedUrl(selectedPic.name);

      if (info.status == 200) {
        const putRes = await putImage(info.data.signedUrl, selectedPic);

        if (putRes.status === 200) {
          // On success send information to server to be stored
          updateDB();
        } else {
          showError({
            type: errorTypes.uploaderror,
            message:
              `Unable to upload profile picture. Contact Support: ` +
              putRes.error,
          });
          dispatch({ type: 'setProcessOff' });
        }
      } else {
        showError({
          type: errorTypes.uploaderror,
          message: `Unable to get signed URl. Contact Support: ` + info.error,
        });

        dispatch({ type: 'setProcessOff' });
      }
    } else {
      updateDB();
    }
  }

  function updateDB() {
    const data = {};

    // Sort out what needs to be updated
    for (let elem in formData) {
      if (!(formData[elem] === initialState[elem])) {
        // // console.log(`${elem} is different from initial`);
        data[elem] = formData[elem].value;
      }
    }

    if (selectedPic) {
      data.profilePic = {
        fileName: selectedPic.name,
      };
    }

    // Send to server
    updateUser({ data });
  }

  // Sets the modal state
  function setModalState(newState) {
    dispatch({ type: 'updateModal', payload: newState });
  }

  // Deletes user account
  function deleteAccount() {
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Delete Your Account?',
      actionHandler: () => {
        // console.log('Deleting Account...');
        // call redux delete account
        deleteUser();
      },
    });
  }

  // Handles toggling edit mode
  function handleEditMode() {
    if (editMode) {
      setModalState({
        show: true,
        type: 'confirm',
        message: 'Discard Changes?',
        actionHandler: () => {
          setModalState({ show: false });
          dispatch({ type: 'editModeOff' });
        },
      });
    } else {
      dispatch({ type: 'editMode', payload: true });
    }
  }

  function handleImageChange(evt) {
    fileRef.current.click();
  }

  function handleFileChoose(evt) {
    const file = evt.target.files[0];
    dispatch({ type: 'selectPic', payload: file });
  }

  // Computes the src image for the img tag for initial render
  async function setInitialImgSrc() {
    if (selectedPic) {
      // console.log('Pic was selected');
      dispatch({
        type: 'setUserPic',
        payload: URL.createObjectURL(selectedPic),
      });
    } else if (profilePic && profilePic.fileName) {
      // console.log('Gettinf profile pic form s3');
      // get picture from s3 and return
      const info = await getPresignedUrl(profilePic.s3Key);

      if (info && info.status === 200) {
        const response = await getImage(info.data.signedUrl);

        if (response && response.status === 200) {
          dispatch({
            type: 'setUserPic',
            payload: URL.createObjectURL(response.image),
          });
        } else {
          showError({
            type: 'inputerror',
            message:
              'Error in fetching signed url for profile pic: ' + info.error,
          });
        }
      } else {
        showError({
          type: 'inputerror',
          message:
            'Error in fetching signed url for profile pic: ' + info.error,
        });
      }
    } else {
      // console.log('Returning default picture');
      dispatch({
        type: 'setUserPic',
        payload: defaultUserPic,
      });
    }
  }

  return (
    <section>
      <Modal modalState={modalState} setModalState={setModalState} />
      <PagePrompt show={editMode} message='Discard Changes?' />
      <ScrollTop />
      <PageHeader
        headerTxt='User Profile'
        showEdit={true}
        handleEdit={handleEditMode}
        handleDelete={deleteAccount}
        editMode={editMode}
      />

      {/* Form Body */}
      <main
        className={`flex flex-col justify-center align-center ${style.mainBody} ${style.container}`}>
        <div className={`flex justify-center align-center ${style.infoHolder}`}>
          {/* Image Container */}
          <div className={`${style.imgContainer}`}>
            <input
              type='file'
              hidden
              ref={fileRef}
              onChange={handleFileChoose}
            />

            <div
              className={`flex justify-center align-center ${style.profilePic}`}>
              {editMode && (
                <div
                  onClick={handleImageChange}
                  className={`flex justify-center align-center ${style.fileBtn}`}>
                  <FiCamera className={`${style.fileIcon}`} />
                </div>
              )}

              {!userPic ? (
                <div className={`flex align-center justify-center`}>
                  <FaSpinner
                    className={`iconRotate dark-text ${style.spinIcon}`}
                  />
                </div>
              ) : (
                <img
                  src={userPic}
                  alt={`profile image`}
                  className={`${style.imgHolder}`}
                />
              )}
            </div>
          </div>

          {/* Profile Form  */}
          <div
            className={`flex flex-col justify-center align-center ${style.detailHolder}`}>
            <div className={`${style.detailItem}`}>
              <label className={`${style.detailLabel}`}>
                <h5>Username</h5>
              </label>
              <input
                type='text'
                placeholder='Username'
                value={formData.username}
                onChange={handleChange}
                name='username'
                disabled={!editMode}
                className={`dark-text ${style.detailInput}`}
              />
            </div>
            <div className={`${style.detailItem}`}>
              <label className={`${style.detailLabel}`}>
                <h5>First Name</h5>
              </label>
              <input
                type='text'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
                name='firstName'
                disabled={!editMode}
                className={`dark-text ${style.detailInput}`}
              />
            </div>
            <div className={`${style.detailItem}`}>
              <label className={`${style.detailLabel}`}>
                <h5>Last Name</h5>
              </label>
              <input
                type='text'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
                name='lastName'
                disabled={!editMode}
                className={`dark-text ${style.detailInput}`}
              />
            </div>
            <div className={`${style.detailItem}`}>
              <label className={`${style.detailLabel}`}>
                <h5>Email</h5>
              </label>
              <input
                type='text'
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                name='email'
                disabled={!editMode}
                className={`dark-text ${style.detailInput}`}
              />
            </div>
          </div>
        </div>

        {/* Update Buttons */}
        {editMode && (
          <div
            className={`flex justify-between align-center ${style.btnGroup} ${style.btnSpread}`}>
            <button
              type='button'
              className={`dark-text ${style.btn}`}
              disabled={processOn}
              onClick={updateProfile}>
              {processOn ? (
                <FiLoader className={`iconRotate dark-text`} />
              ) : (
                <h5>Update Profile</h5>
              )}
            </button>
            <button
              type='button'
              className={`dark-text ${style.btn}`}
              disabled={processOn}
              onClick={handleEditMode}>
              <h5>Cancel</h5>
            </button>
          </div>
        )}
      </main>
    </section>
  );
}

function mapStateToProps(state) {
  const { userInfo } = state.app;

  return { userInfo };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteUser: () =>
      dispatch(deleteAccount({ fetchBody: {}, method: 'POST' })),
    updateUser: fetchBody =>
      dispatch(
        updateProfile({
          fetchBody: fetchBody,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
