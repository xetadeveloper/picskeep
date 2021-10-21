// Modules
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { observeElement, useShowError } from '../../Custom Hooks/customHooks';
import { getPresignedUrl } from '../../Utils/utils';

// Styles
import style from './pictureHolder.module.css';

// Components
import { NavLink } from 'react-router-dom';
import { FiCircle } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

function Picture({ picture }) {
  const [retrieveUrl, setRetrieveUrl] = useState(false);
  const [picUrl, setPicUrl] = useState(null);
  // console.log('PicUrl: ', picUrl);

  const pictureRef = useRef();
  const showError = useShowError();

  // Attaches the observer to picture
  useEffect(() => {
    // console.log('Observer element');
    // Find out how many times this rerenders
    const observerOptions = {
      rootMargin: '200px 0px',
    };

    //Observing the picture element
    observeElement(
      pictureRef.current,
      () => {
        setRetrieveUrl(true);
      },
      observerOptions,
      true
    );
  }, [picture]);

  // For fetching the pic url from server
  useEffect(async () => {
    if (retrieveUrl) {
      console.log('Fetching url from server');
      const info = await getPresignedUrl('newfile.jpg');

      if (info.status === 200) {
        setPicUrl(info.data.signedUrl);
      } else {
        setRetrieveUrl(false);
        showError({
          type: 'inputerror',
          message: 'Error in fetching signed url: ' + info.error,
        });
      }
    }
  }, [retrieveUrl]);

  return (
    <NavLink
      ref={pictureRef}
      to={`/pictures?pictureID=${picture.fileID}`}
      className={`flex flex-col align-center justify-between dark-text ${style.pictureItem}`}>
      {!picUrl ? (
        <div className={`flex align-center justify-center ${style.picImg}`}>
          <FaSpinner className={`iconRotate dark-text ${style.spinIcon}`} />
        </div>
      ) : (
        <img src={picUrl} className={`${style.picImg}`} alt='' />
      )}
      <h5>{picture.name}</h5>
    </NavLink>
  );
}

function mapStateToProps(state) {
  const { urlArray } = state.app;

  return { urlArray };
}

function mapDispatchToProps(dispatch) {
  return {
    // getPresignedUrl: dispatch(getPresignedUrl()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Picture);
