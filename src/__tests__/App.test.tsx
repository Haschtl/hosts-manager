import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import App from '../renderer/App';
import store from '../renderer/store';

describe('App', () => {
  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>
      )
    ).toBeTruthy();
  });
});
