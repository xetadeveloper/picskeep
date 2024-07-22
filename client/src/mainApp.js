// Modules
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useHistory,
} from 'react-router-dom';

// Styles
import style from './mainApp.module.css';

// Redux
import { connect } from 'react-redux';
import { getUserInfo, restoreSession } from './Redux/Actions/httpActions';

// Components
import { FiPlus } from 'react-icons/fi';
import Home from './Layouts/Home/home';
import Profile from './Layouts/Profile/profile';
import Picture from './Layouts/Picture/picture';
import NotFound from './Layouts/NotFound/notFound';
import Folder from './Layouts/Folder/folder';
import TopNav from './Components/TopNav/topNav';
import Preferences from './Layouts/Preferences/preferences';
import Settings from './Layouts/Settings/settings';
import Modal from './Components/Modals/modal';
import ScrollTop from './Components/ScrollTop/scrollTop';
import DropModal from './Components/DropModal/dropModal';
import LoadingCircle from './Components/LoadingCircle/loadingCircle';

function MainApp(props) {
  const { error, isLoggedIn, restoreSession, redirectToLogin, getUserInfo } =
    props;

  const [modalState, setModalState] = useState({ show: false });
  const [dropModal, setDropModal] = useState(false);

  // console.log('Client logged in: ', isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      // console.log('Restoring session..');
      restoreSession();
    } else if (isLoggedIn) {
      // console.log('Getting user info');
      getUserInfo();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (error) {
      // console.log('Error: ', error)
      setDropModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (redirectToLogin) {
      // location.href = 'http://localhost:5000/login';
      window.location.href = '/login';
    }
  }, [redirectToLogin]);

  const navLinks = [
    { path: '/', text: 'Home' },
    { path: '/preferences', text: 'Preferences' },
    { path: '/logout', text: 'Logout' },
  ];

  return (
    <div className={`${style.container}`}>
      {/* Add baseName to router */}
      <BrowserRouter basename='/app'>
        <ScrollTop />
        <Modal modalState={modalState} setModalState={setModalState} />
        <TopNav links={navLinks} />
        <DropModal
          text={error ? error.message : ''}
          show={dropModal}
          setDropModal={setDropModal}
        />

        {true ? (
          <Switch>
            <Route path='/profile' component={Profile} />
            <Route path='/preferences' component={Preferences} />
            <Route path='/settings' component={Settings} />
            <Route path='/folders' component={Folder} />
            <Route path='/pictures' component={Picture} />
            <Route
              path='/logout'
              render={() => {
                // window.location.href = 'http://localhost:5000/logout';
                window.location.href = '/logout';
              }}
            />
            <Route path='/' component={Home} />
            <Route component={NotFound} />
          </Switch>
        ) : (
          <section
            className={`flex flex-col justify-center align-center ${style.altPage}`}>
            {/* <h2>Logging In</h2>
            <FiLoader className={`iconRotate dark-text ${style.loaderIcon}`} /> */}
            <LoadingCircle text='Logging You In' />
          </section>
        )}
      </BrowserRouter>

      {/* Fab Button */}
      <div
        className={`flex justify-center align-center brand-bg light-text ${style.fabBtn}`}
        onClick={() => {
          setModalState({
            show: true,
            type: 'upload',
          });
        }}>
        <FiPlus className={style.fabIcon} />
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  const { error, isLoggedIn, redirectToLogin } = state.app;

  return { error, isLoggedIn, redirectToLogin };
}

function mapDispatchToProps(dispatch) {
  return {
    restoreSession: () => dispatch(restoreSession()),
    getUserInfo: () => dispatch(getUserInfo()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
