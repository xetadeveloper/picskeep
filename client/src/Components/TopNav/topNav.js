// Modules
import React, { useCallback, useMemo, useState } from 'react';
import withPictureSearch from '../../HOC/withPictureSearch';

// Styles
import style from './topNav.module.css';

// Components
import { NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar/searchBar';
import { FiMenu } from 'react-icons/fi';
import { useSearchList } from '../../Custom Hooks/customHooks';

export default function TopNav({ links }) {
  const [showMenu, setShowMenu] = useState(false);
  const [filtered, setFiltered] = useState([]);

  const searchList = useSearchList();

  // console.log('Filtered: ', filtered);

  function renderLinks(links) {
    return links.map((link, index) => {
      const { path, text } = link;

      return (
        <li
          key={index}
          className={`${style.navItem}`}
          onClick={() => {
            setShowMenu(false);
          }}>
          <NavLink to={path}>{text}</NavLink>
        </li>
      );
    });
  }

  function renderFilteredPics(filteredResults) {
    return filteredResults.map((file, index) => {
      return file.type === 'picture' ? (
        <li key={index} className={style.filteredItem}>
          <NavLink to={`/picture?pictureID=${file.fileID}`}>
            {file.name}
          </NavLink>
        </li>
      ) : null;
    });
  }

  function renderFilteredFolders(filteredResults) {
    return filteredResults.map((file, index) => {
      return file.type === 'folder' ? (
        <li key={index} className={style.filteredItem}>
          <NavLink to={`/folder?folderID=${file.fileID}`}>{file.name}</NavLink>
        </li>
      ) : null;
    });
  }

  function filterFunc(file, searchTxt) {
    return searchTxt.trim() ? file.name.startsWith(searchTxt) : false;
  }

  function setSearchResult(result) {
    // console.log('Search Result: ', result);

    setFiltered(result);
  }

  return (
    <section
      className={`brand-bg light-text flex justify-between align-center ${style.navContainer}`}>
      <h3 className={`logo`}>PicsKeep</h3>
      <div
        className={`flex flex-col justify-center align-center ${style.searchComp}`}>
        {/* Search Bar Holder */}
        <div className={`dark-text ${style.searchHolder}`}>
          <SearchBar
            searchList={searchList}
            filterFunc={filterFunc}
            setFound={setSearchResult}
          />
        </div>

        {/* Search Result List Holder */}
        <ul
          className={` ${style.searchResult} ${
            !filtered.length && style.show
          }`}>
          <li className={`${style.filterSection}`}>
            <h6 className={`${style.filterHeader}`}>Folders</h6>
            {filtered.length ? renderFilteredFolders(filtered) : null}
          </li>
          <li className={`${style.filterSection}`}>
            <h6 className={`${style.filterHeader}`}>Pictures</h6>
            {filtered.length ? renderFilteredPics(filtered) : null}
          </li>
        </ul>
      </div>
      <div className={`${style.navHolder}`}>
        <FiMenu
          className={`icon ${style.menuBtn}`}
          onClick={() => {
            setFiltered([]);
            setShowMenu(prev => !prev);
          }}
        />
        <ul className={`flex ${style.navlist} ${showMenu && style.dropDown} `}>
          {renderLinks(links)}
        </ul>
      </div>
    </section>
  );
}
