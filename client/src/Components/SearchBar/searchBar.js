// Modules
import React, { useEffect, useState } from 'react';

// Styles
import style from './searchBar.module.css';

// Components
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar(props) {
  const { setFound, searchList, filterFunc, placeHolder } = props;

  const [searchText, setSearchText] = useState();

  // Handles the input change control
  function handleInputChange(evt) {
    const searchTxt = evt.target.value;
    setSearchText(searchTxt);
    handleSearch(searchTxt);
  }

  const handleSearch = searchTxt => {
    const itemsFound =
      searchList && searchList.filter(item => filterFunc(item, searchTxt));
    setFound(itemsFound);
  };

  return (
    <div
      className={`flex align-center justify-between ${style.searchContainer}`}>
      <input
        type='text'
        placeholder={placeHolder || 'Search'}
        className={style.searchInput}
        onChange={handleInputChange}
        value={searchText}
        onBlur={() => {
          setSearchText('');
          setFound([]);
        }}
      />
      {searchText && searchText.trim() ? (
        <FiX
          className={`dark-text ${style.searchIcon}`}
          onClick={() => {
            setSearchText('');
            handleSearch('');
          }}
        />
      ) : (
        <FiSearch className={`dark-text ${style.searchIcon}`} />
      )}
    </div>
  );
}
