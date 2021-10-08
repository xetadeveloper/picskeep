//Modules
import { FiX } from 'react-icons/fi';
import React, { useState } from 'react';

//Styles
import style from '../modalStyle.module.css';

export default function InputModal(props) {
  let iconLib = props.iconLib;
  const { modalState, closeModal } = props;
  const { message, actionHandler, inputData, error, submitBtnText } =
    modalState;

  const initialForm = {};

  inputData.forEach(inputItem => {
    initialForm[inputItem.inputName] = '';
  });

  const [formData, setFormData] = useState(initialForm);

  function handleInputChange(evt) {
    setFormData(prev => {
      return { ...prev, [evt.target.name]: evt.target.value };
    });
  }

  // Renders the inputs
  function renderInputs() {
    return inputData.map((inputItem, index) => {
      const { inputMsg, inputName, inputType, placeholder } = inputItem;
      return (
        <div
          key={index}
          className={`flex flex-col align-center justify-center ${style.modalInputHolder}`}>
          <h2 className={`${style.modalInputText}`}>{inputMsg}</h2>
          <input
            type={inputType}
            placeholder={placeholder}
            className={`${style['modal-input']} 
            ${
              error &&
              error.errorFields.find(errorInput => {
                return errorInput.field === inputName;
              })
                ? style.redBorder
                : ''
            }`}
            name={inputName}
            value={formData[inputName]}
            onChange={handleInputChange}
          />
        </div>
      );
    });
  }

  return (
    <div
      className={`
          flex
          flex-col
          align-center justify-center 
          ${style['modal-body']}
          ${style['modal-skin']}
      `}>
      <button className={`${style['modal-close-btn']}`} onClick={closeModal}>
        <FiX />
      </button>
      <h3>{message}</h3>
      {renderInputs()}
      <button
        className={`${style['modal-btn']} ${style['modal-btn-lg']}`}
        onClick={evt => {
          actionHandler(evt, formData);
        }}>
        {submitBtnText || 'Submit'}
      </button>
    </div>
  );
}
