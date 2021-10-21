// Modules
import React from 'react';

// Styles
import style from './gallery.module.css';

// Components
import Picture from '../PictureHolder/pictureHolder';

export default function Gallery({ pictures }) {
  function renderPictures() {
    return pictures.map((picture, index) => {
      return <Picture picture={picture} key={index} />;
    });
  }

  return (
    <section className={`flex ${style.pictureBody}`}>
      {pictures && pictures.length
        ? renderPictures()
        : "You don't have any pictures"}
    </section>
  );
}
