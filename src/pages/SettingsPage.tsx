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
import {State} from '../store/types';
import colors from '../styles/colors';
import {IsDarkMode} from '../styles/styles';
import CheckBox from '@react-native-community/checkbox';

const SettingsPage: React.FC<ScreenComponentType> = ({navigation}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <SettingsHeader navigation={navigation} />
      <View style={settingsStyle.group}>
        <Text style={settingsStyle.groupHeader}>General</Text>
        <TouchableOpacity style={settingsStyle.element}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_brightness_medium_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>Activate dark-mode</Text>
          <CheckBox />
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_sync_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>Automatic updates</Text>
          <CheckBox />
        </TouchableOpacity>
      </View>
      <View style={settingsStyle.group}>
        <Text style={settingsStyle.groupHeader}>Block ADs</Text>
        <TouchableOpacity style={settingsStyle.element}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_superuser_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>
            Admin based AD-blocker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element} disabled>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_vpn_key_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>VPN based AD-blocker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_ipv6_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>Activate IPv6</Text>
          <CheckBox />
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element}>
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
        <TouchableOpacity style={settingsStyle.element}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/outline_cloud_upload_24.svg')}
          />
          <Text style={settingsStyle.elementContent}>Send error reports</Text>
          <CheckBox />
        </TouchableOpacity>
        <TouchableOpacity style={settingsStyle.element}>
          <Image
            style={settingsStyle.elementIcon}
            source={require('../drawable/ic_bug_report_24dp.svg')}
          />
          <Text style={settingsStyle.elementContent}>
            Activate extended logging
          </Text>
          <CheckBox />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type Props = {
  children?: React.ReactNode;
} & ScreenComponentType;
let SettingsHeader: React.FC<Props> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>Settings</Text>
    </Header>
  );
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps)(SettingsPage);
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
  elementContent: {
    flex: 1,
  },
  elementIcon: {margin: 13, marginRight: 25},
});
