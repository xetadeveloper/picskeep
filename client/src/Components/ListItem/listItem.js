// Modules
import React from 'react';
import { NavLink } from 'react-router-dom';

// Styles
import style from './listItem.module.css';

// Components

export default function ListItem({ path, itemName, onClick }) {
  return (
    <div className={`${style.listBox} ${style.container}`}>
      {path ? (
        <NavLink to={path} className={`${style.listItem}`} onClick={onClick}>
          {itemName}
        </NavLink>
      ) : (
        <div className={`${style.listItem}`} onClick={onClick}>
          {itemName}
        </div>
      )}
    </div>
  );
}
