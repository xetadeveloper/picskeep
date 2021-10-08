// Modules
import React from 'react';

// Styles
import style from './pageHeaderEdit.module.css';

// Components
import { FiSettings, FiTrash } from 'react-icons/fi';

export default function PageHeader(props) {
  const { handleEdit, handleDelete, headerTxt, editMode } = props;

  return (
    <header>
      <section
        className={`flex justify-between align-center ${style.container} ${style.profileHeader} `}>
        <h5 className={`bold-text ${style.headerTxt}`}>{headerTxt}</h5>
        <div className={`flex ${style.container} ${style.btnGroup}`}>
          <FiSettings
            className={`${style.icon} ${editMode && style.activeIcon}`}
            onClick={handleEdit}
          />
          <FiTrash className={`${style.icon}`} onClick={handleDelete} />
        </div>
      </section>
      <div className={`divider`}></div>
    </header>
  );
}
