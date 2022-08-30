import React from 'react';
import StartPage from './pages/StartPage';
import VersionPage from './pages/VersionPage';
import ListViewPage from './pages/ListViewPage';
import SupportPage from './pages/SupportPage';
import SourcesPage from './pages/SourcesPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DNSPage from './pages/DNSPage';
import SourceEditor from './pages/SourceEditor';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createDrawerNavigator} from '@react-navigation/drawer';

const Stack = createBottomTabNavigator();

const Routes = () => (
  <Stack.Navigator
    key="root"
    id="routes"
    screenOptions={({}) => ({
      tabBarIcon: () => <></>,
      tabBarStyle: {height: 0},
      tabBar: () => <></>,
      header: () => <></>,
      // headerShown: false,
    })}>
    <Stack.Screen
      name="home"
      key="home"
      component={StartPage}
      options={{title: 'Home'}}
    />
    <Stack.Screen
      name="start"
      key="start"
      component={StartPage}
      options={{title: 'Home'}}
    />
    <Stack.Screen
      name="version"
      key="version"
      component={VersionPage}
      options={{title: 'Version'}}
    />
    <Stack.Screen
      name="list"
      key="list"
      component={ListViewPage}
      options={{title: 'List'}}
    />
    <Stack.Screen
      name="settings"
      key="settings"
      component={SettingsPage}
      options={{title: 'Settings'}}
    />
    <Stack.Screen
      name="sources"
      key="sources"
      component={SourcesPage}
      options={{title: 'Sources'}}
    />
    <Stack.Screen
      name="editsource"
      key="editsource"
      component={SourceEditor}
      options={{title: 'Edit Source'}}
    />
    <Stack.Screen
      name="support"
      key="support"
      component={SupportPage}
      options={{title: 'Support'}}
    />
    <Stack.Screen name="help" component={HelpPage} options={{title: 'Help'}} />
    <Stack.Screen name="dns" component={DNSPage} options={{title: 'DNS'}} />
  </Stack.Navigator>
);
export default Routes;
