//Modules
import React from 'react';

//Components
import ConfirmModal from './ConfirmModal/confirmModal';
import MessageModal from './MessageModal/messageModal';
import InputModal from './InputModal/inputModal';
import LoadingModal from './LoadingModal/loadingModal';
import UploadModal from './UploadModal/uploadModal';

//Styles
import style from './modal.module.css';

export default function Modal(props) {
  const { modalState, setModalState } = props;
  const { parentProps } = props;

  const { show, modalCloseHandler } = modalState;

  /**This closes the modal */
  function closeModal() {
    if (modalCloseHandler) {
      // This is for extra actions when closing the modal, for example cleanup
      modalCloseHandler();
    }

    setModalState({ show: false });
  }

  return (
    <div>
      {show && (
        <section
          className={`flex align-center justify-center ${style.modalContainer}`}>
          {modalState.type === 'confirm' ? (
            <ConfirmModal
              modalState={modalState}
              setModalState={setModalState}
              closeModal={closeModal}
            />
          ) : modalState.type === 'message' ? (
            <MessageModal
              modalState={modalState}
              setModalState={setModalState}
              closeModal={closeModal}
            />
          ) : modalState.type === 'input' ? (
            <InputModal
              modalState={modalState}
              setModalState={setModalState}
              closeModal={closeModal}
            />
          ) : modalState.type === 'loading' ? (
            <LoadingModal
              modalState={modalState}
              setModalState={setModalState}
              closeModal={closeModal}
            />
          ) : modalState.type === 'upload' ? (
            <UploadModal
              modalState={modalState}
              setModalState={setModalState}
              closeModal={closeModal}
            />
          ) : null}
        </section>
      )}
    </div>
  );
}
