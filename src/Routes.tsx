import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StartPage from './pages/StartPage';
import VersionPage from './pages/VersionPage';
import ListViewPage from './pages/ListViewPage';
import SupportPage from './pages/SupportPage';
import SourcesPage from './pages/SourcesPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DNSPage from './pages/DNSPage';

const Stack = createNativeStackNavigator();

const Routes = () => (
  <Stack.Navigator key="root">
    <Stack.Screen name="home" component={StartPage} options={{title: 'Home'}} />
    <Stack.Screen
      name="start"
      component={StartPage}
      options={{title: 'Home'}}
    />
    <Stack.Screen
      name="version"
      component={VersionPage}
      options={{title: 'Version'}}
    />
    <Stack.Screen
      name="list"
      component={ListViewPage}
      options={{title: 'List'}}
    />
    <Stack.Screen
      name="<settings>"
      component={SettingsPage}
      options={{title: 'Settings'}}
    />
    <Stack.Screen
      name="sources"
      component={SourcesPage}
      options={{title: 'Sources'}}
    />
    <Stack.Screen
      name="support"
      component={SupportPage}
      options={{title: 'Support'}}
    />
    <Stack.Screen name="help" component={HelpPage} options={{title: 'Help'}} />
    <Stack.Screen name="dns" component={DNSPage} options={{title: 'DNS'}} />
  </Stack.Navigator>
);
export default Routes;
