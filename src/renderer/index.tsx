/* eslint no-console: off */
import React from 'react';
import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import 'react-windows-ui/config/app-config.css';
import 'react-windows-ui/dist/react-windows-ui-11.min.css';
import 'react-windows-ui/icons/fonts/fonts.min.css';

import App from './App';
import store from './store';
import ScrollToTop from './components/ScrollToTop';
import './index.scss';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <HashRouter>
        <ScrollToTop />
        <App />
      </HashRouter>
    </Provider>
  );
} else {
  console.log("Missing 'root' element in DOM");
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
