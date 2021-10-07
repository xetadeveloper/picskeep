// Modules
import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// Styles
import style from './mainApp.module.css';

// Redux
import { connect } from 'react-redux';

// Components
import Home from './Layouts/Home/home';
import Profile from './Layouts/Profile/profile';
import Dashboard from './Layouts/Dashboard/dashboard';
import Picture from './Layouts/Picture/picture';
import NotFound from './Layouts/NotFound/notFound';
import Folder from './Layouts/Folder/folder';
import TopNav from './Components/TopNav/topNav';
import { useSearchList } from './Custom Hooks/customHooks';
import { FiPlus } from 'react-icons/fi';
import Preferences from './Layouts/Preferences/preferences';

function MainApp(props) {
  // Redux Props

  const navLinks = [
    { path: '/home', text: 'Home' },
    { path: '/dashboard', text: 'DashBoard' },
    { path: '/preferences', text: 'Preferences' },
    { path: '/logout', text: 'Logout' },
  ];

  function uploadPicture(evt) {
    // Call upload modal here with upload component
  }

  return (
    <div className={`${style.container}`}>
      <BrowserRouter>
        <TopNav links={navLinks} />
        <Switch>
          <Route path='/profile' component={Profile} />
          <Route path='/preferences' component={Preferences} />
          <Route path='/folders' component={Folder} />
          <Route path='/pictures' component={Picture} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/home' component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
      <div
        className={`flex justify-center align-center brand-bg light-text ${style.fabBtn}`}
        onClick={uploadPicture}>
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
