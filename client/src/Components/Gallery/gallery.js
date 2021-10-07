// Modules
import React from 'react';
import { NavLink } from 'react-router-dom';
import { appMode } from '../../config';

// Styles
import style from './gallery.module.css';

// Components

export default function Gallery({ pictures }) {
  function renderPictures() {
    return pictures.map((picture, index) => {
      return (
        <NavLink
          key={index}
          to={`/pictures?pictureID=${picture.fileID}`}
          className={`flex flex-col align-center justify-between dark-text ${style.pictureItem}`}>
          <img
            src={appMode === 'dummy' ? picture.pic : picture.url}
            className={`${style.picImg}`}
          />
          <h5>{picture.name}</h5>
        </NavLink>
      );
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
