// Modules
import React from 'react';

// Styles
import style from './largeButton.module.css';

// Components
import { FiLoader } from 'react-icons/fi';

export default function Button({ btnText, onClick }) {
  return (
    <button
      disabled={isOps}
      className={`flex justify-center align-center dark-text ${style.btn} 
    ${isOps && style.wideBtn}`}
      onClick={onClick}>
      <h5 hidden={isOps} className={`${style.btnText}`}>
        {btnText}
      </h5>
      {!isOps && children}
      {isOps && <FiLoader className={`iconRotate`} />}
    </button>
  );
}
