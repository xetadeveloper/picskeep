// Modules
import React from 'react';

// Styles
import style from './loadingCircle.module.css';

// Components
import { FaCircle } from 'react-icons/fa';

export default function LoadingCircle({ text }) {
  return (
    <div className={`flex flex-col ${style.container}`}>
      <h3>{text}</h3>
      <div className={`flex justify-center align-center ${style.circleHolder}`}>
        <FaCircle className={`${style.circle} ${style.firstCircle}`} />
        <FaCircle className={`${style.circle} ${style.secondCircle}`} />
        <FaCircle className={`${style.circle} ${style.thirdCircle}`} />
      </div>
    </div>
  );
}
