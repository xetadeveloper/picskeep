// Modules
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useSearchList } from './Custom Hooks/customHooks';

// Styles
import style from './mainApp.module.css';

// Redux
import { connect } from 'react-redux';

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

function MainApp(props) {
  const [modalState, setModalState] = useState({ show: false });

  // Redux Props

  const navLinks = [
    { path: '/home', text: 'Home' },
    { path: '/dashboard', text: 'DashBoard' },
    { path: '/preferences', text: 'Preferences' },
    { path: '/logout', text: 'Logout' },
  ];

  return (
    <div className={`${style.container}`}>
      <BrowserRouter>
        <ScrollTop />
        <Modal modalState={modalState} setModalState={setModalState} />
        <TopNav links={navLinks} />
        <Switch>
          <Route path='/profile' component={Profile} />
          <Route path='/preferences' component={Preferences} />
          <Route path='/settings' component={Settings} />
          <Route path='/folders' component={Folder} />
          <Route path='/pictures' component={Picture} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/home' component={Home} />
          <Route component={NotFound} />
        </Switch>
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
  const {} = state.app;

  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
