import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
/* eslint no-console: off */

import { Provider } from 'react-redux';

import 'react-windows-ui/config/app-config.css';
import 'react-windows-ui/dist/react-windows-ui-11.min.css';
import 'react-windows-ui/icons/fonts/fonts.min.css';
import './index.scss';
// import reportWebVitals from './reportWebVitals';
import App from './App';
import store from './store';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    // </React.StrictMode>
  );

  // calling IPC exposed from preload script
  // window.electron.ipcRenderer.once('ipc-example', (arg) => {
  //   // eslint-disable-next-line no-console
  //   console.log(arg);
  // });
  // window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
} else {
  console.log("Missing 'root' element in DOM");
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
