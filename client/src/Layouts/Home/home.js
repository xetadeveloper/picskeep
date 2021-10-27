// Modules
import React, { useState } from 'react';
import { useSearchList } from '../../Custom Hooks/customHooks';

// Styles
import style from './home.module.css';

// Components
import { NavLink } from 'react-router-dom';
import Gallery from '../../Components/Gallery/gallery';
import { FiChevronDown, FiFolder } from 'react-icons/fi';

export default function Home() {
  const fileList = useSearchList();

  const [folderState, setFolderState] = useState(false);
  const [pictureState, setPictureState] = useState(true);

  // console.log('FileList: ', fileList);

  // Renders the folders list
  function renderFolders() {
    return fileList
      .filter(file => file.type === 'folder')
      .map((folder, index) => {
        return (
          <NavLink
            key={index}
            to={`/folders?folderID=${folder.fileID}`}
            className={`align-center justify-center dark-text ${style.folderItem}`}>
            <FiFolder className={`${style.folderIcon}`} />
            <h6 className={style.folderName}>{folder.name}</h6>
            <div
              className={`flex align-center justify-center ${style.picCount}`}>
              {folder.pictures ? folder.pictures.length : '0'}
            </div>
          </NavLink>
        );
      });
  }

  return (
    <section className={`${style.container}`}>
      {/* Folders Section */}
      {false && (
        <section className={`${style.groupSection}`}>
          <div
            className={`flex align-center justify-between ${style.groupHeader}`}>
            <h5 className={`bold-text`}>Your Folders</h5>
            <FiChevronDown
              className={`icon dark-text ${style.dropIcon}   
             ${folderState ? style.downArrow : style.upArrow}`}
              onClick={() => {
                setFolderState(prev => !prev);
              }}
            />
          </div>
          <div className={`divider`}></div>
          <section
            className={`align-center ${style.folderBody} 
          ${folderState ? style.show : style.hide}`}>
            {renderFolders()}
          </section>
        </section>
      )}

      {/* Pictures Section */}
      <section className={`${style.groupSection}`}>
        <div
          className={`flex align-center justify-between ${style.groupHeader}`}
          onClick={() => {
            setPictureState(prev => !prev);
          }}>
          <h5 className={`bold-text`}>Your Pictures</h5>
          <FiChevronDown
            className={`icon dark-text ${style.dropIcon} 
            ${pictureState ? style.downArrow : style.upArrow}`}
          />
        </div>
        <div className={`divider`}></div>

        <section
          className={`${style.galleryHolder}
          ${pictureState ? style.show : style.hide}`}>
          <Gallery
            pictures={fileList.filter(file => file.type === 'picture')}
          />
        </section>
      </section>
    </section>
  );
}
