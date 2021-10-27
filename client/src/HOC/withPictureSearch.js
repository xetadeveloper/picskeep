import { useCallback, useState } from 'react';

export default function withPictureSearch(SearchComponent) {
  return function ConnectedComp(props) {
    const { setFound, searchList, filterFunc } = props;

    const handleSearch = useCallback(searchTxt => {
      // filter the pictures list for the pictureName
      const itemsFound =
        searchList && searchList.filter(item => filterFunc(item, searchTxt));
      // console.log('Found: ', itemsFound);
      setFound(itemsFound);
    }, []);

    return <SearchComponent handleSearch={handleSearch} />;
  };
}
