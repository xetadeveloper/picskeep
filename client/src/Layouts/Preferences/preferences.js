// Modules
import React, { useState } from 'react';
import ListItem from '../../Components/ListItem/listItem';
import Modal from '../../Components/Modals/modal';
import PageHeader from '../../Components/PageHeader/pageHeader';

// Styles
import style from './preferences.module.css';

// Components

export default function Preferences() {
  const [modalState, setModalState] = useState({ show: false });

  function handlePasswordChange() {
    // Handle password change
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Change Password?',
      actionHandler: () => {
        setModalState({
          show: true,
          type: 'password',
          actionHandler: () => {
            console.log('Changing password...');
            // call redux update password
          },
        });
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
