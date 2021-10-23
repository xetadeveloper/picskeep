// Modules
import React from 'react';
import { FiX } from 'react-icons/fi';

// Styles
import style from './dropModal.module.css';

// Components

export default function DropModal({ text, show, setDropModal }) {

  return (
    <section
      className={`flex justify-center align-center ${style.dropHolder} 
      ${style.container} ${show ? style.show : style.hide}`}>
      <div className={`${style.cancel}`} onClick={() => {
        setDropModal(false);
      }}>
        <FiX className={`${style.cancelIcon}`} />
      </div>
      <div className={`flex justify-center align-center ${style.text}`}>
        <h6>{text}</h6>
      </div>
    </section>
  );
}
