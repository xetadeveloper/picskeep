// Modules
import React, { useEffect, useState } from 'react';
import { FiDownload, FiLoader, FiSun, FiTrash } from 'react-icons/fi';

// Redux
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { dummyPictures } from '../../DummyData/dummy';

// Styles
import style from './picture.module.css';

// Components
import ScrollTop from '../../Components/ScrollTop/scrollTop';
import Modal from '../../Components/Modals/modal';
import { getPresignedUrl } from '../../Utils/utils';
import {
  useFlags,
  useResetFlags,
  useShowError,
} from '../../Custom Hooks/customHooks';
import { deletePicture, updatePicture } from '../../Redux/Actions/httpActions';
import { appMode } from '../../config';

function Picture({ pictures, deletePicture, updatePicture }) {
  const pictureID = new URLSearchParams(useLocation().search).get('pictureID');
  const [modalState, setModalState] = useState({ show: false });

  let picture;

  if (appMode === 'dummy') {
    picture =
      dummyPictures &&
      dummyPictures.find(picture => picture.picID === pictureID);
  } else {
    picture = pictures && pictures.find(picture => picture.picID === pictureID);
  }

  // States
  const [picName, setPicName] = useState(picture ? picture.fileName : '');
  const [txtFocus, setTxtFocus] = useState(false);
  const [picUrl, setPicUrl] = useState(null);

  // console.log('Picture: ', picUrl);
  const showError = useShowError();
  const { isDeleted } = useFlags();
  const resetFlags = useResetFlags();
  const history = useHistory();

  // For fetching the pic url from server
  useEffect(() => {
    async function fetchUrl() {
      console.log('Fetching url from server');
      const info = await getPresignedUrl(picture.s3Key);

      if (info.status === 200) {
        setPicUrl(info.data.signedUrl);
      } else {
        showError({
          type: 'inputerror',
          message: 'Error in fetching signed url: ' + info.error,
        });
      }
    }

    fetchUrl();
  }, [setPicUrl]);

  useEffect(() => {
    if (isDeleted.value) {
      history.push('/');
    }
  }, [isDeleted]);

  useEffect(() => {
    return () => {
      resetFlags();
    };
  }, []);

  function handleInputChange(evt) {
    const inputVal = evt.target.value;
    setPicName(inputVal);
  }

  // Updates the picture name if the input lost focus
  function updatePicName(evt) {
    //   Update the picture name
    if (txtFocus) {
      // Run update
      setTxtFocus(false);
      console.log('PicName: ', picName);
      console.log('New PicName: ', picture.fileName);
      if (picName !== picture.fileName) {
        updatePicture({ data: { picture: picture, newFileName: picName } });
      }
    }
  }

  // Downloads the picture
  async function downloadPic() {
    const info = await getPresignedUrl(picture.s3Key);

    if (info.status === 200) {
      const link = document.createElement('a');
      link.href = info.data.signedUrl;
      link.setAttribute('hidden', true);
      link.setAttribute('download', 'image.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // console.log('Image downloaded...');
    } else {
      showError({
        type: 'inputerror',
        message: 'Error in fetching signed url for download: ' + info.error,
      });
    }
  }

  function deletePic() {
    // Delete the picture
    setModalState({
      show: true,
      type: 'confirm',
      message: 'Delete Picture?',
      actionHandler: () => {
        // Run delete here
        deletePicture({ data: { pic: picture } });
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
        <div
          className={`flex justify-center align-center ${style.picImgHolder} ${
            picUrl && style.picHeight
          }`}>
          {picUrl ? (
            <img src={picUrl} className={`${style.picImg}`} alt='' />
          ) : (
            <FiSun className={`iconRotate ${style.loadingIcon}`} />
          )}
        </div>
      </section>

      {/* Show picture details here */}
      <section className={`flex justify-center`}>Picture Details </section>
    </section>
  );
}

function mapStateToProps(state) {
  const { pictures } = state.app;

  return { pictures };
}

function mapDispatchToProps(dispatch) {
  return {
    deletePicture: fetchBody =>
      dispatch(
        deletePicture({
          fetchBody: fetchBody,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      ),

    updatePicture: fetchBody =>
      dispatch(
        updatePicture({
          fetchBody: fetchBody,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Picture);
