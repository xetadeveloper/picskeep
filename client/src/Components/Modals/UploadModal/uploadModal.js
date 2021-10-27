//Modules
import React, { useEffect, useRef, useState } from 'react';
import {
  useFlags,
  useResetFlags,
  useShowError,
} from '../../../Custom Hooks/customHooks';
import { errorTypes } from '../../../config';

//Styles
import style from './uploadModal.module.css';

// Redux
import { connect } from 'react-redux';
import { getPutUrls } from '../../../Redux/Actions/httpActions';
import { s3Upload } from '../../../Redux/Actions/appActions';

// Components
import { FiFolder, FiLoader, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import Modal from '../modal';
import LoadingCircle from '../../LoadingCircle/loadingCircle';

function UploadModal(props) {
  const { closeModal, putUrls, getPutUrls, s3Upload } = props;
  const [fileList, setFileList] = useState([]);
  const [innerModalState, setInnerModalState] = useState({ show: false });
  const fileRef = useRef();
  // console.log('FileList State: ', fileList);
  // // console.log('FileList length: ', fileList.length);
  const showError = useShowError();
  const resetFlags = useResetFlags();
  const { isCreated, isUploading } = useFlags();

  // To reset flag state
  useEffect(() => {
    return () => {
      resetFlags();
    };
  }, []);

  useEffect(() => {
    if (putUrls.length) {
      // console.log('Uploading Pictures...: ', putUrls);
      if (putUrls.length === fileList.length) {
        // console.log('Array lengths match');

        const uploadPics = fileList.map((file, index) => {
          return { file, signedUrl: putUrls[index].signedUrl };
        });

        s3Upload({ pictures: uploadPics });
      } else {
        displayErr('UrlList length is not equal to FileList length. Contact Support')
      }
    }
  }, [putUrls]);

  useEffect(() => {
    if (isCreated.value) {
      // console.log('Pictures were successfuly uploaded');

      setFileList([]);
      setInnerModalState({
        show: true,
        type: 'message',
        message: 'Pictures were uploaded successfully',
      });
    }
  }, [isCreated]);

  function uploadPictures() {
    if (fileList.length) {
      // console.log('Sending file list to server...');
      getPutUrls({ data: { fileNames: fileList.map(file => file.name) } });
    }
  }

  function displayErr(message) {
    setInnerModalState({
      show: true,
      type: 'message',
      message: 'Upload Failed. Contact Support'
    });

    showError({
      type: errorTypes.servererror,
      message
    });
  }

  function removeSelection(index) {
    const tempList = [...fileList];
    tempList.splice(index, 1);
    setFileList(tempList);
  }

  // Handles the rendering of the files
  function renderFiles() {
    const fileArray = Array.from(fileList);
    return fileArray.map((file, index) => {
      return (
        <div
          key={index}
          className={`flex flex-col justify-center align-center ${style.fileItem}`}>
          <FiTrash
            className={`${style.deletePic}`}
            onClick={() => removeSelection(index)}
          />
          <img
            src={URL.createObjectURL(file)}
            className={`${style.selectedPic}`}
          />
          <h6 className={`${style.fileName}`}>{file.name}</h6>
        </div>
      );
    });
  }

  // Opens the fle chooser
  function openFileChooser() {
    fileRef.current.click();
  }

  // Handles choosing file and updating state
  function handleFileChoose(evt) {
    // console.log('Event: ', evt);
    const files = Array.from(evt.target.files);
    // // console.log('Files Selected: ', files);

    fileList.forEach(oldFile => {
      files.forEach((newFile, index) => {
        // // console.log('New File: ', newFile);

        // Check of file is image first
        if (!newFile.type.startsWith('image')) {
          files.splice(index, 1);
          return;
        }

        // Check if file is already in the list
        if (oldFile.name === newFile.name) {
          files.splice(index, 1);
        }
      });
    });

    if (files.length) {
      // add files if there are file to add
      setFileList(prev => {
        if (fileList.length) {
          return [...prev, ...files];
        } else {
          return files;
        }
      });
    }
  }

  return (
    <section className={`${style.container} ${style.uploadModal}`}>
      <Modal modalState={innerModalState} setModalState={setInnerModalState} />
      <section className={`flex flex-col ${style.uploadInner}`}>
        <section
          className={`flex align-center
          ${!fileList.length ? 'justify-end' : 'justify-between'}  
          ${style.navHeader}`}>
          {/* Add and Delete Buttons */}
          {fileList.length ? (
            <div className={`flex ${style.btnGroup}`}>
              <button
                disable={isUploading}
                onClick={openFileChooser}
                className={`flex justify-center align-center dark-text ${style.btn}`}>
                <h5 className={`${style.btnText}`}>Add More</h5>
                <FiPlus className={`${style.btnIcon}`} />
              </button>
              <button
                disable={isUploading}
                onClick={() => {
                  setFileList([]);
                }}
                className={`flex justify-center align-center dark-text ${style.btn}`}>
                <h5 className={`${style.btnText}`}>Clear Selection</h5>
                <FiTrash className={`${style.btnIcon}`} />
              </button>
            </div>
          ) : null}
          <FiX
            className={`dark-text ${style.cancelBtn}`}
            onClick={() => {
              if (fileList.length) {
                setInnerModalState({
                  show: true,
                  type: 'confirm',
                  message: 'Cancel Upload?',
                  actionHandler: () => {
                    closeModal();
                  },
                });
              } else closeModal();
            }}
          />
        </section>

        {/* Browser section */}
        {!fileList.length > 0 ? (
          <section
            onClick={openFileChooser}
            className={`flex flex-col justify-center align-center dark-text ${style.picBrowser}`}>
            <h1 className={`${style.browserHeader}`}>Browse For Pictures</h1>
            <FiFolder className={`${style.icon}`} />
          </section>
        ) : (
          <section className={`${style.files}`}>
            {isUploading &&
              <div
                className={`flex flex-col justify-center align-center dark-text ${style.uploading}`}>
                <LoadingCircle text='Uploading' />
              </div>
            }
            {renderFiles()}
          </section>
        )}

        <input
          type='file'
          multiple
          hidden
          ref={fileRef}
          onChange={handleFileChoose}
        />

        {/* Update Button */}
        {fileList.length > 0 ? (
          <button
            className={`dark-text ${style.container} ${style.uploadBtn}`}
            disable={isUploading}
            onClick={uploadPictures}>
            {isUploading ? (
              <FiLoader className={`iconRotate dark-text`} />
            ) : (
              <h5>Upload Pictures</h5>
            )}
          </button>
        ) : null}
      </section>
    </section>
  );
}

function mapStateToProps(state) {
  const { putUrls } = state.app;

  return { putUrls };
}

function mapDispatchToProps(dispatch) {
  return {
    getPutUrls: fetchBody =>
      dispatch(
        getPutUrls({
          method: 'POST',
          fetchBody: fetchBody,
          headers: { 'Content-Type': 'application/json' },
        })
      ),

    s3Upload: fetchBody => dispatch(s3Upload(fetchBody)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadModal);
