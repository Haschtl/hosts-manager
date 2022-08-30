/* Todo:
- Show Group
- Enable/disable groups
- Enable/disable all
- Update button, if link specified
- Add button (list of known ad blockers), Add button in each group, add group button
- Find,remove duplicates
*/

import React, {useEffect} from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';
import {StatusBar} from 'react-native-windows';
import colors from './styles/colors';
import {IsDarkMode} from './styles/styles';
import {request} from 'react-native-permissions';
import Routes from './Routes';
import {NavigationContainer} from '@react-navigation/native';
import {connect, Provider} from 'react-redux';
import store from './store';
// import {systray} from './utils/systray';
import {loadState} from './store/reducer';
import * as actions from './store/actions';
import {State} from './store/types';
// import notifier from './utils/notifier';

export type ScreenComponentType = {
  route?: {params: any};
  navigation: any;
};

// notifier.notify({
//   title: 'My notification',
//   message: 'Hello, there!',
// });

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const App: React.FC<Props> = ({setState, setElevated}) => {
  request('windows.permission.allowElevation').then(v => {
    console.log(v);
    if (v === 'unavailable') {
      setElevated(false);
    }
  });
  const isDarkMode = IsDarkMode();
  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  useEffect(() => {
    loadState()
      .then(state => {
        // console.log(state);
        setState(state);
      })
      .catch(e => console.warn(e));
  }, [setState]);
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

const mapDispatchToProps = {
  setState: actions.setState,
  setElevated: actions.setElevated,
};
// export default App;
const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
let _App = connect(mapStateToProps, mapDispatchToProps)(App);
let __App: React.FC<ScreenComponentType> = ({navigation}) => {
  return (
    <Provider store={store}>
      <_App navigation={navigation} />
    </Provider>
  );
};
export default __App;
