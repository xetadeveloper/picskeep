//Modules
import React from 'react';
import { FiX } from 'react-icons/fi';

//Styles
import style from '../modalStyle.module.css';

export default function MessageModal(props) {
  let faLib = props.iconLib;
  const { modalState, closeModal } = props;

  return (
    <div
      className={`flex flex-col align-center justify-center ${style['modal-body']} ${style['modal-skin']}`}>
      <button className={`${style['modal-close-btn']}`} onClick={closeModal}>
        <FiX />
      </button>
      <h3 className={`${style['modal-text']}`}>{modalState.message}</h3>
      <button className={`${style['modal-btn']}`} onClick={closeModal}>
        Close
      </button>
    </div>
  );
}
