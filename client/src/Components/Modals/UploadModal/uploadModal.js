//Modules
import React, { useEffect, useRef, useState } from 'react';
import { useShowError } from '../../../Custom Hooks/customHooks';
import { errorTypes } from '../../../config';

//Styles
import style from './uploadModal.module.css';

// Redux
import { connect } from 'react-redux';
import { getPutUrls } from '../../../Redux/Actions/httpActions';
import { s3Upload } from '../../../Redux/Actions/appActions';

// Components
import { FiFolder, FiPlus, FiTrash, FiX } from 'react-icons/fi';
import Modal from '../modal';
import Button from '../../Buttons/SmallButton/smallButton';

function UploadModal(props) {
  const { closeModal, putUrls, getPutUrls, isUploading, s3Upload, isCreated } =
    props;
  const [fileList, setFileList] = useState([]);
  const [innerModalState, setInnerModalState] = useState({ show: false });
  const fileRef = useRef();
  console.log('FileList State: ', fileList);
  // console.log('FileList length: ', fileList.length);
  const showError = useShowError();

  useEffect(() => {
    if (putUrls.length) {
      console.log('Uploading Pictures...: ', putUrls);
      if (putUrls.length === fileList.length) {
        console.log('Array lengths match');

        const uploadPics = fileList.map((file, index) => {
          return { file, signedUrl: putUrls[index].signedUrl };
        });

        s3Upload({ pictures: uploadPics });
      } else {
        showError({
          type: errorTypes.servererror,
          message:
            'UrlList length is not equal to FileList length. Contact Support',
        });
      }
    }
  }, [putUrls]);

  useEffect(() => {
    if (isCreated.value) {
      console.log('Pictures were successfuly uploaded');
      setInnerModalState({
        show: true,
        type: 'message',
        message: 'Pictures were uploaded successfully',
      });
    }
  }, [isCreated]);

  function uploadPictures() {
    if (fileList.length) {
      console.log('Sending file list to server...');
      getPutUrls({ data: { fileNames: fileList.map(file => file.name) } });
    }
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
    console.log('Event: ', evt);
    const files = Array.from(evt.target.files);
    // console.log('Files Selected: ', files);

    fileList.forEach(oldFile => {
      files.forEach((newFile, index) => {
        // console.log('New File: ', newFile);

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
                onClick={openFileChooser}
                className={`flex justify-center align-center dark-text ${style.btn}`}>
                <h5 className={`${style.btnText}`}>Add More</h5>
                <FiPlus className={`${style.btnIcon}`} />
              </button>
              <button
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
          <section className={`${style.files}`}>{renderFiles()}</section>
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
            onClick={uploadPictures}>
            <h5>Upload Pictures</h5>
          </button>
        ) : null}
      </section>
    </section>
  );
}

function mapStateToProps(state) {
  const { putUrls, isUploading } = state.app;
  const { isCreated } = state.flags;

  return { putUrls, isCreated, isUploading, isCreated };
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
