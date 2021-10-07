// Modules
import React, { useReducer, useState } from 'react';
import { FiSettings, FiTrash } from 'react-icons/fi';

// Styles
import style from './profile.module.css';

// Components

const initialState = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'updateInput':
      return { ...state, [payload.name]: payload.value };

    default:
      return state;
  }
}

export default function Profile(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  console.log('Profile State: ', state);

  function handleChange(evt) {
    const name = evt.target.name;
    const value = evt.target.value;

    dispatch({ type: 'updateInput', payload: { name, value } });
  }
  return (
    <section>
      <header
        className={`flex justify-between align-center ${style.container} ${style.profileHeader} `}>
        <h5 className={`bold-text ${style.headerTxt}`}>User Profile</h5>
        <div className={`flex ${style.container} ${style.btnGroup}`}>
          <FiSettings className={`${style.icon}`} />
          <FiTrash className={`${style.icon}`} />
        </div>
      </header>
      <div className={`divider`}></div>
      <main
        className={`flex flex-col justify-center align-center ${style.mainBody} ${style.container}`}>
        <div className={`${style.profilePic}`}>
          <img alt={`profile image`} className={`${style.imgHolder}`} />
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
              value={state.username}
              onChange={handleChange}
              name='username'
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
              value={state.firstName}
              onChange={handleChange}
              name='firstName'
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
              value={state.lastName}
              onChange={handleChange}
              name='lastName'
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
              value={state.email}
              onChange={handleChange}
              name='email'
              className={`dark-text ${style.detailInput}`}
            />
          </div>
        </div>
        {/* Update Buttons */}
        <div
          className={`flex justify-between align-center ${style.btnGroup} ${style.btnSpread}`}>
          <button type='button' className={`dark-text ${style.btn}`}>
            <h5>Update Profile</h5>
          </button>
          <button type='button' className={`dark-text ${style.btn}`}>
            <h5>Cancel</h5>
          </button>
        </div>
      </main>
    </section>
  );
}
