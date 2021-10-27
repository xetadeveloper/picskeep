// Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './Redux/Store/store';

// Styles
import './index.css';

// Components
import MainApp from './mainApp';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MainApp />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
