// Modules
import React, { useEffect, useReducer } from 'react';
import { profileReducer, initialState } from './profileState';
import { connect } from 'react-redux';

// Styles
import style from './profile.module.css';

// Components
import PagePrompt from '../../Components/PagePrompt/pagePrompt';
import { FiSettings, FiTrash } from 'react-icons/fi';
import Modal from '../../Components/Modals/modal';
import defaultUserPic from '../../Images/user icon.png';
import ScrollTop from '../../Components/ScrollTop/scrollTop';
import PageHeader from '../../Components/PageHeaderEdit/pageHeaderEdit';

function Profile({ userInfo }) {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const { formData, editMode, modalState } = state;

  // console.log('FormData: ', formData);

  useEffect(() => {
    // console.log('Running Effect');
    dispatch({ type: 'setinitialform', payload: userInfo });
  }, [userInfo]);

  // Handles input change
  function handleChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    dispatch({ type: 'updateInput', payload: { [name]: value } });
  }

  /** Updates the profile*/
  function updateProfile() {}

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
        console.log('Deleting Account...');
        // call redux delete account
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
          dispatch({ type: 'editMode', payload: false });
        },
      });
    } else {
      dispatch({ type: 'editMode', payload: true });
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
        <div className={`${style.imgContainer}`}>
          <div></div>
          <div className={`${style.profilePic}`}>
            <img
              alt={`profile image`}
              className={`${style.imgHolder}`}
              src={defaultUserPic}
            />
          </div>
        </div>
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
        {/* Update Buttons */}
        {editMode && (
          <div
            className={`flex justify-between align-center ${style.btnGroup} ${style.btnSpread}`}>
            <button
              type='button'
              className={`dark-text ${style.btn}`}
              onClick={updateProfile}>
              <h5>Update Profile</h5>
            </button>
            <button
              type='button'
              className={`dark-text ${style.btn}`}
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
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
