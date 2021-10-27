// Modules
import React, { useEffect, useState } from 'react';
import ListItem from '../../Components/ListItem/listItem';
import Modal from '../../Components/Modals/modal';
import PageHeader from '../../Components/PageHeader/pageHeader';
import {
  useFlags,
  useResetFlags,
  useShowError,
} from '../../Custom Hooks/customHooks';
import { updatePassword } from '../../Redux/Actions/httpActions';

import { connect } from 'react-redux';

// Styles
import style from './preferences.module.css';

// Components

function Preferences({ error, updatePassword }) {
  const [modalState, setModalState] = useState({ show: false });

  const showError = useShowError();
  const { isUpdated } = useFlags();
  const resetFlags = useResetFlags();

  useEffect(() => {
    if (isUpdated.value) {
      setModalState({
        show: true,
        type: 'message',
        message: 'Password Updated Successfuly',
      });
    }
  }, [isUpdated]);

  useEffect(() => {
    if (error && error.errorFields) {
      changePassword(error);
    }
  }, [error]);

  // resets the flags on unmount
  useEffect(() => {
    return () => {
      resetFlags();
    };
  }, []);

  function changePassword(error) {
    setModalState({
      show: true,
      type: 'input',
      inputData: [
        {
          inputName: 'oldPassword',
          inputMsg: 'Enter Old Password',
          inputType: 'password',
          placeholder: 'Enter old password',
        },
        {
          inputName: 'newPassword',
          inputMsg: 'Enter New Password',
          inputType: 'password',
          placeholder: 'Enter new password',
        },
        {
          inputName: 'confirmPassword',
          inputMsg: 'Confirm New Password',
          inputType: 'password',
          placeholder: 'Confirm new password',
        },
      ],
      error,
      actionHandler: (evt, formData) => {
        // forward data to server
        const { newPassword, confirmPassword } = formData;

        if (newPassword != confirmPassword) {
          // console.log('Password do not match');
          const error = {
            type: 'inputerror',
            message: "Passwords Don't Match",
            errorFields: [
              {
                field: 'newPassword',
                message: "Passwords Don't Match",
              },
              {
                field: 'confirmPassword',
                message: "Passwords Don't Match",
              },
            ],
          };

          showError(error);
          changePassword(error);
        } else {
          // console.log('Passwords match');
          setModalState({ show: false });

          // send the data to server
          updatePassword({ data: formData });
        }
      },
    });
  }

  function handlePasswordChange() {
    // Handle password change
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Change Password?',
      actionHandler: () => {
        changePassword();
      },
    });
  }

  return (
    <section className={`${style.container} ${style.prefHolder}`}>
      <Modal modalState={modalState} setModalState={setModalState} />
      <PageHeader headerTxt='Preferences' />
      <section className={`${style.listHolder}`}>
        <ListItem itemName='User Profile' path='/profile' />
        <ListItem itemName='Settings' path='/settings' />
        <ListItem itemName='Change Password' onClick={handlePasswordChange} />
      </section>
    </section>
  );
}

function mapStateToProps(state) {
  const { error } = state.app;

  return { error };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePassword: fetchBody =>
      dispatch(
        updatePassword({
          fetchBody: fetchBody,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
