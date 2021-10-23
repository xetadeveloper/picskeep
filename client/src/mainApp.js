// Modules
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// Styles
import style from './mainApp.module.css';

// Redux
import { connect } from 'react-redux';
import { getUserInfo, restoreSession } from './Redux/Actions/httpActions';

// Components
import { FiPlus } from 'react-icons/fi';
import Home from './Layouts/Home/home';
import Profile from './Layouts/Profile/profile';
import Dashboard from './Layouts/Dashboard/dashboard';
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
import Logout from './Layouts/Logout/logout';

function MainApp(props) {
  const { error, isLoggedIn, restoreSession, redirectToLogin, getUserInfo } =
    props;

  const [modalState, setModalState] = useState({ show: false });
  const [dropModal, setDropModal] = useState(false);

  console.log('Client logged in: ', isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('Restoring session..');
      restoreSession();
    } else if (isLoggedIn) {
      console.log('Getting user info');
      getUserInfo();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (error) {
      // console.log('Error: ', error)
      setDropModal(true);
    }
  }, [error]);

  const navLinks = [
    { path: '/app/home', text: 'Home' },
    { path: '/app/dashboard', text: 'DashBoard' },
    { path: '/app/preferences', text: 'Preferences' },
    { path: '/app/logout', text: 'Logout' },
  ];

  return (
    <div className={`${style.container}`}>
      <BrowserRouter>
        <ScrollTop />
        <Modal modalState={modalState} setModalState={setModalState} />
        <TopNav links={navLinks} />
        <DropModal
          text={error ? error.message : ''}
          show={dropModal}
          setDropModal={setDropModal}
        />

        {isLoggedIn ? (
          <Switch>
            <Route path='/app/profile' component={Profile} />
            <Route path='/app/logout' component={Logout} />
            <Route path='/app/preferences' component={Preferences} />
            <Route path='/app/settings' component={Settings} />
            <Route path='/app/folders' component={Folder} />
            <Route path='/app/pictures' component={Picture} />
            <Route path='/app/dashboard' component={Dashboard} />
            <Route path='/app/home' component={Home} />
            <Redirect from='/' to='/home' />
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

        {redirectToLogin && <Redirect to='/login' />}
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
