import React from 'react';
import { FaSpinner } from 'react-icons/fa';

// Styles
import style from '../modalStyle.module.css';

export default function Loading(props) {
  const { modalState } = props;

  return (
    <div
      className={`flex flex-col align-items-center justify-content-center ${style.loading}`}>
      <h1>{modalState.message}</h1>
      <h2>
        <FaSpinner className={style.faSpin} />
      </h2>
    </div>
  );
}

/*
- Maybe use a GIF for the loading here
*/
