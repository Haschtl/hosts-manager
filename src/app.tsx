/* Todo:
- Show Group
- Enable/disable groups
- Enable/disable all
- Update button, if link specified
- Add button (list of known ad blockers), Add button in each group, add group button
- Find,remove duplicates
*/

import React from 'react';
import type {ReactNode} from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';
import {StatusBar} from 'react-native-windows';
import colors from './styles/colors';
import {IsDarkMode} from './styles/styles';
import Routes from './Routes';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './store';
import {systray} from './utils/systray';
// import notifier from './utils/notifier';

export type ScreenComponentType = {
  route?: any;
  navigation: any;
};

// notifier.notify({
//   title: 'My notification',
//   message: 'Hello, there!',
// });
const App: () => ReactNode = () => {
  const isDarkMode = IsDarkMode();
  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <Provider store={store}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </SafeAreaView>
    </Provider>
  );
};

export default App;
