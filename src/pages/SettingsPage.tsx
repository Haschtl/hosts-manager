import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
// import {Footer} from '../components/Footer';

import {connect} from 'react-redux';
import {Settings, State} from '../store/types';
import colors from '../styles/colors';
import {IsDarkMode} from '../styles/styles';
import CheckBox from '@react-native-community/checkbox';
import * as actions from '../store/actions';
import {NotImplemented} from '../components/NotImplemented';
import {saveConfig} from '../files';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const SettingsPage: React.FC<Props> = ({navigation, settings, setSettings}) => {
  const isDarkMode = IsDarkMode();
  let [notImplemented, setNotImplemented] = React.useState(false);
  let hideNotImplemented = () => {
    setNotImplemented(false);
  };
  let setAdminBasedAdblock = () => {
    setNotImplemented(true);
  };
  let setVPNBasedAdblock = () => {
    setNotImplemented(true);
  };
  let _setSettings = (settings: Settings) => {
    saveConfig(settings);
    setSettings(settings);
  };
  let toggleLogging = () =>
    _setSettings({...settings, logging: !settings.logging});
  let toggleDarkMode = () =>
    _setSettings({...settings, darkMode: !settings.darkMode});
  let toggleAutoUpdates = () =>
    _setSettings({...settings, autoUpdates: !settings.autoUpdates});
  let toggleIpv4 = () => _setSettings({...settings, ipv6: !settings.ipv6});
  let toggleDiagnostics = () =>
    _setSettings({...settings, diagnostics: !settings.diagnostics});
  let startBackup = () => {
    setNotImplemented(true);
  };
  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  console.log(settings);
  return (
    <View style={backgroundStyle}>
      <NotImplemented onDismiss={hideNotImplemented} isOpen={notImplemented} />
      <SettingsHeader navigation={navigation} />
      <View style={settingsStyle.group}>
        <Text style={settingsStyle.groupHeader}>General</Text>
        <TouchableOpacity
          style={settingsStyle.element}
          onPress={toggleDarkMode}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_brightness_medium_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>Activate dark-mode</Text>
          <CheckBox value={settings.darkMode} onChange={toggleDarkMode} />
        </TouchableOpacity>
        <TouchableOpacity
          style={settingsStyle.element}
          onPress={toggleAutoUpdates}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_sync_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>Automatic updates</Text>
          <CheckBox value={settings.autoUpdates} onChange={toggleAutoUpdates} />
        </TouchableOpacity>
      </View>
      <View style={settingsStyle.group}>
        <Text style={settingsStyle.groupHeader}>Block ADs</Text>
        <TouchableOpacity
          style={[
            settingsStyle.element,
            settings.blockMode !== 'admin'
              ? settingsStyle.elementDisabled
              : settingsStyle.elementEnabled,
          ]}
          onPress={setAdminBasedAdblock}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_superuser_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>
            Admin based AD-blocker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            settingsStyle.element,
            settings.blockMode === 'admin'
              ? settingsStyle.elementDisabled
              : settingsStyle.elementEnabled,
          ]}
          onPress={setVPNBasedAdblock}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_vpn_key_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>VPN based AD-blocker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element} onPress={toggleIpv4}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_ipv6_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>Activate IPv6</Text>
          <CheckBox value={settings.ipv6} onChange={toggleIpv4} />
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element} onPress={startBackup}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_sd_storage_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>
            Backup/Recover your lists
          </Text>
        </TouchableOpacity>
      </View>
      <View style={settingsStyle.group}>
        <Text style={settingsStyle.groupHeader}>Diagnoses</Text>
        <TouchableOpacity
          style={settingsStyle.element}
          onPress={toggleDiagnostics}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/outline_cloud_upload_24.svg')}
          />
          <Text style={settingsStyle.elementContent}>Send error reports</Text>
          <CheckBox value={settings.diagnostics} onChange={toggleDiagnostics} />
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element} onPress={toggleLogging}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_bug_report_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>
            Activate extended logging
          </Text>
          <CheckBox value={settings.logging} onChange={toggleLogging} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type HProps = {
  children?: React.ReactNode;
} & ScreenComponentType;
let SettingsHeader: React.FC<HProps> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>Settings</Text>
    </Header>
  );
};
const mapDispatchToProps = {
  setSettings: actions.setSettings,
};

const mapStateToProps = (state: State) => {
  return {settings: state.app.settings};
};
export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
export const settingsStyle = StyleSheet.create({
  group: {
    display: 'flex',
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: colors.dark,
  },
  groupHeader: {
    marginLeft: 62,
    marginTop: 20,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '400',
  },
  element: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementDisabled: {opacity: 0.5},
  elementEnabled: {},
  elementContent: {
    flex: 1,
  },
  elementIcon: {margin: 13, marginRight: 25},
});
