// Modules
import React, { useState } from 'react';
import { FiDownload, FiTrash } from 'react-icons/fi';

// Redux
import { connect } from 'react-redux';
import { useLocation } from 'react-router';
import { dummyPictures } from '../../DummyData/dummy';

// Styles
import style from './picture.module.css';

// Components
import ScrollTop from '../../Components/ScrollTop/scrollTop';
import Modal from '../../Components/Modals/modal';

function Picture({ pictures }) {
  const pictureID = new URLSearchParams(useLocation().search).get('pictureID');
  const [modalState, setModalState] = useState({ show: false });

  //   const picture =
  //     pictures && pictures.find(picture => picture.fileID === pictureID);

  const picture =
    dummyPictures &&
    dummyPictures.find(picture => picture.fileID === pictureID);

  // States
  const [picName, setPicName] = useState(picture ? picture.name : '');
  const [txtFocus, setTxtFocus] = useState(false);

  //   console.log('Picture: ', picture);

  function handleInputChange(evt) {
    const inputVal = evt.target.value;
    setPicName(inputVal);
  }

  // Updates the picture name if the input lost focus
  function updatePicName() {
    //   Update the picture name
    if (txtFocus) {
      // Run update
      setTxtFocus(false);
    }
  }

  function downloadPic() {
    // Download the picture
  }

  function deletePic() {
    // Delete the picture
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Delete Picture?',
      actionHandler: () => {
        // Run delete here
      },
    });
  }

  return (
    <section className={`${style.picPage}`}>
      <ScrollTop />
      <Modal modalState={modalState} setModalState={setModalState} />
      {/* Picture Nav */}
      <section
        className={`flex justify-between align-center ${style.container} ${style.navbar}`}>
        {/* Change to text field for easy update */}
        <input
          type='text'
          value={picName}
          className={`${style.picName} ${txtFocus && style.inputFocus}`}
          onChange={handleInputChange}
          onFocus={() => {
            if (!txtFocus) {
              console.log('Gaining Focus');
              setTxtFocus(true);
            }
          }}
          onBlur={updatePicName}
        />
        <div className={`flex ${style.btnGroup} `}>
          <button
            className={`flex justify-center align-center ${style.btn}`}
            onClick={downloadPic}>
            <h5 className={`bold-text ${style.btnText}`}>Download</h5>
            <FiDownload />
          </button>
          <button
            className={`flex justify-center align-center ${style.btn}`}
            onClick={deletePic}>
            <h5 className={`bold-text ${style.btnText}`}>Delete</h5>
            <FiTrash />
          </button>
        </div>
      </section>

      {/* Pic Viewer */}
      <section className={`${style.container} ${style.viewer}`}>
        <img src={picture.pic} className={`${style.picImg}`} />
      </section>

      {/* Show picture details here */}
      <section></section>
    </section>
  );
}

function mapStateToProps(state) {
  const { pictures } = state.app;

  return { pictures };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Picture);
