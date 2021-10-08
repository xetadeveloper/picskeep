// Modules
import React from 'react';
import { FiLoader } from 'react-icons/fi';

// Styles
import style from './fancyButton.module.css';

// Components

export default function FancyButton({ btnText, onClick, children, isOps }) {
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
