import { useSelector } from 'react-redux';
import { appMode } from '../config';
import { dummySearchList } from '../DummyData/dummy';

/** Returns the list of pictures and folders together
 * @returns list of folders and pictures
 */
export function useSearchList() {
  const pictures = useSelector(state => state.app.pictures);
  const folders = useSelector(state => state.app.folders);

  const list = [];
  const dummyList = dummySearchList;

  if (folders && folders.length) {
    list.push(...folders);
  }

  if (pictures && pictures.length) {
    list.push(...pictures);
  }

  return appMode === 'dummy' ? dummyList : list;
}
