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
import {SafeAreaView, ScrollView, StatusBar, ViewStyle} from 'react-native';
import {StartPage} from './pages/StartPage';
import colors from './styles/colors';
import {IsDarkMode} from './styles/styles';

const App: () => ReactNode = () => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <StartPage />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
