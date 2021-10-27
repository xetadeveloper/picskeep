//Modules
import { FiX } from 'react-icons/fi';
import React, { useState } from 'react';

//Styles
import style from '../modalStyle.module.css';

export default function InputModal(props) {
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
            id={inputName}
            name={inputName}
            value={formData[inputName]}
            onChange={handleInputChange}
            required
          />
        </div>
      );
    });
  }

  return (
    <form
      onSubmit={evt => {
        evt.preventDefault();
        actionHandler(evt, formData);
      }}
      className={`
          flex
          flex-col
          align-center justify-center 
          ${style['modal-body']}
          ${style['modal-skin']}
      `}>
      <button
        type='button'
        className={`${style['modal-close-btn']}`}
        onClick={closeModal}>
        <FiX />
      </button>
      <h3>{message}</h3>
      {renderInputs()}
      <button
        type='submit'
        className={`${style['modal-btn']} ${style['modal-btn-lg']} ${style['modal-btn-wide']}`}>
        {submitBtnText || 'Submit'}
      </button>
    </form>
  );
}
