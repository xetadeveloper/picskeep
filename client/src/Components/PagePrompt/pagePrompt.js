import React, { useEffect, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';

// Components
import Modal from '../Modals/modal';

export default function PagePrompt(props) {
  const { show, message } = props;

  const [routeLeave, setRouteLeave] = useState({ route: '', canLeave: false });
  const [modalState, setModalState] = useState({ show: false });

  // console.log('Route Leave: ', routeLeave);

  const history = useHistory();

  // Handles the page refreshing or exiting the page
  useEffect(() => {
    if (show && !routeLeave.canLeave) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  });

  // Handles leaving the page in react
  useEffect(() => {
    if (routeLeave.canLeave) {
      // console.log('Leaving page...');
      history.push(routeLeave.route);
    }
  }, [routeLeave.canLeave]);

  function handleBeforeUnload(evt) {
    evt.returnValue = '';
  }

  return (
    <div>
      <Modal modalState={modalState} setModalState={setModalState} />

      <Prompt
        when={show}
        message={location => {
          // console.log('Location: ', location);
          if (!routeLeave.canLeave) {
            setRouteLeave(prev => {
              return { ...prev, route: location.pathname + location.search };
            });

            setModalState({
              show: true,
              type: 'confirm',
              message,
              actionHandler: () => {
                // console.log('Just clicked yes to leave page..');
                setModalState({ show: false });
                setRouteLeave(prev => {
                  return { ...prev, canLeave: true };
                });
              },
              modalCloseHandler: () => {
                history.goForward();
              },
            });

            return false;
          }
        }}
      />
    </div>
  );
}
