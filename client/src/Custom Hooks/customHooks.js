import { useDispatch, useSelector } from 'react-redux';
import { appMode } from '../config';
import { dummySearchList } from '../DummyData/dummy';
import { showError, updateAppState } from '../Redux/Actions/appActions';

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

// Hook for observing elements and specifying animations
export function observeElement(
  element,
  elementHandler,
  observerOptions = {},
  once
) {
  // const [isVisible, setIsVisible] = useState(false);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        elementHandler();

        if (once) {
          observer.unobserve(element);
        }
      }
    });
  }, observerOptions);

  observer.observe(element);

  return { observer };
}

// Hook to dispatch errors
export function useShowError() {
  const dispatch = useDispatch();
  return function (error) {
    dispatch(showError(error));
  };
}

// Hook to dispatch errors
export function useUpdateApp() {
  const dispatch = useDispatch();
  return function (data) {
    dispatch(updateAppState(data));
  };
}
