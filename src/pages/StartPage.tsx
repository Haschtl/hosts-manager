import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableHighlight,
  ImageURISource,
  ScrollView,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {ScreenComponentType} from '../App';
import Footer from '../components/Footer';
import {connect} from 'react-redux';
import {State} from '../store/types';

// import SvgUri from 'react-native-svg-uri';
import colors from '../styles/colors';
import {IsDarkMode} from '../styles/styles';
// import isElevated from '../utils/isElevated';
// import {IsDarkMode} from '../styles/styles';
type Props = ScreenComponentType & {
  active: boolean;
};
const StartPage: React.FC<Props> = ({navigation, active}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  const pageStyle: ViewStyle = {
    display: 'flex',
    flex: 1,
  };
  let [isAdmin, setIsElevated] = useState(true);
  // isElevated().then(v => setIsElevated(v));

  let updateSources = () => {};
  let upgradeSources = () => {};

  return (
    <View style={pageStyle}>
      {!isAdmin && (
        <View style={contentStyles.adminWarning}>
          <Text style={contentStyles.adminWarningText}>
            AdAway not running as Admin. Can not write hosts file directly
          </Text>
        </View>
      )}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <StartHeader navigation={navigation} active={active} />
        <View style={contentStyles.content}>
          <TouchableHighlight
            style={contentStyles.mainbutton}
            onPress={() => navigation.navigate('sources')}>
            <View style={headerStyles.buttonbar}>
              <View style={contentStyles.mainleft}>
                <Image
                  style={{width: 50, height: 50}}
                  source={require('../drawable/ic_collections_bookmark_24dp.svg')}
                />
              </View>

              <View style={contentStyles.maincenter}>
                <Text
                  style={{color: colors.text, margin: 5, textAlign: 'center'}}>
                  {'3 aktuelle Quellen'}
                </Text>
                <Text
                  style={{color: colors.text, margin: 5, textAlign: 'center'}}>
                  {'3 veraltete Quellen'}
                </Text>
              </View>
              <View style={contentStyles.mainright}>
                <TouchableOpacity style={{margin: 5}} onPress={updateSources}>
                  <Image source={require('../drawable/ic_sync_24dp.svg')} />
                </TouchableOpacity>
                <TouchableOpacity style={{margin: 5}} onPress={upgradeSources}>
                  <Image source={require('../drawable/ic_get_app_24dp.svg')} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        {/* <Text>gg</Text> */}
        <View style={headerStyles.buttonbar}>
          <HeaderButton
            subtitle="Show DNS-Request-Protocol"
            icon={require('../drawable/ic_outline_rule_24.svg')}
            onPress={() => navigation.navigate('dns')}
          />
          <HeaderButton
            subtitle="Show Tips and Help"
            icon={require('../drawable/ic_help_24dp.svg')}
            onPress={() => navigation.navigate('help')}
          />
          <HeaderButton
            subtitle="Support"
            icon={require('../drawable/baseline_favorite_24.svg')}
            onPress={() => navigation.navigate('support')}
          />
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps)(StartPage);

type HProps = ScreenComponentType & {
  active: boolean;
};
export const StartHeader: React.FC<HProps> = ({navigation, active}) => {
  const goToVersion = () => {
    navigation.navigate('version');
  };
  let numBlocked = 194475;
  let numRedirected = 0;
  let numAllowed = 0;
  return (
    <>
      <View
        style={[
          headerStyles.background,
          active
            ? {backgroundColor: colors.primary}
            : {backgroundColor: colors.dark},
        ]}>
        <Image
          style={headerStyles.icon}
          accessibilityRole="image"
          source={require('../drawable/icon_foreground.png')}
        />
        <View style={headerStyles.textWrapper}>
          <Text
            style={[
              headerStyles.title,
              {
                color: colors.white,
              },
            ]}>
            AdAway
          </Text>
          <Text
            style={[
              headerStyles.subtitle,
              {
                color: colors.white,
              },
            ]}>
            Open Source ad blocker
          </Text>
        </View>
        <Text style={headerStyles.abs_version} onPress={goToVersion}>
          {'1.0.0'}
        </Text>
        <View style={headerStyles.abs_buttonbar}>
          <HeaderButton
            title={numBlocked + ''}
            subtitle="Blocked"
            icon={require('../drawable/baseline_block_24.svg')}
            onPress={() => navigation.navigate('list')}
          />
          <HeaderButton
            title={numAllowed + ''}
            subtitle="Allowed"
            icon={require('../drawable/baseline_check_24.svg')}
            onPress={() => navigation.navigate('list')}
          />
          <HeaderButton
            title={numRedirected + ''}
            subtitle="Redirected"
            icon={require('../drawable/baseline_compare_arrows_24.svg')}
            onPress={() => navigation.navigate('list')}
          />
        </View>
      </View>
    </>
  );
};

interface HBProps {
  title?: string;
  subtitle?: string;
  icon?: ImageURISource;
  onPress?(): void;
}
export const HeaderButton: React.FC<HBProps> = ({
  title,
  subtitle,
  icon,
  onPress,
}) => {
  return (
    <View style={buttonStyles.buttonwrapper}>
      <TouchableHighlight
        style={buttonStyles.headerbutton}
        onPress={onPress}
        activeOpacity={0.5}>
        <View style={buttonStyles.content}>
          {title !== undefined && (
            <Text style={buttonStyles.title}>{title}</Text>
          )}
          {subtitle !== undefined && (
            <Text style={buttonStyles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </TouchableHighlight>
      {icon !== undefined ? (
        <View style={buttonStyles.buttonicon}>
          <Image source={icon} style={buttonStyles.icon} />
        </View>
      ) : // <SvgUri width="200" height="200" source={icon} />
      null}
    </View>
  );
};
const contentStyles = StyleSheet.create({
  content: {
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: '2%',
    marginTop: 0,
    marginRight: '2%',
    marginBottom: 20,
  },
  adminWarning: {
    width: '100%',
    backgroundColor: colors.warning,
    padding: 5,
  },
  adminWarningText: {
    fontWeight: '400',
    fontSize: 20,
  },
  mainbutton: {
    // height: 40,
    padding: 10,
    width: '99%',
    backgroundColor: colors.darker,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainleft: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  maincenter: {display: 'flex', flexDirection: 'column', flex: 1, padding: 10},
  mainright: {display: 'flex', flexDirection: 'column', padding: 10},
});
const buttonStyles = StyleSheet.create({
  subtitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '100',
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
  },
  icon: {
    marginTop: 0,
    width: 30,
  },
  content: {
    marginTop: 20,
    marginBottom: 10,
  },
  buttonicon: {
    height: 40,
    width: 40,
    backgroundColor: colors.darker,
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonwrapper: {display: 'flex', flex: 1, alignItems: 'center'},
  headerbutton: {
    // height: 40,
    width: 150,
    marginTop: 20,
    backgroundColor: colors.darker,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const headerStyles = StyleSheet.create({
  background: {
    paddingBottom: 40,
    // backgroundColor: colors.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 80,
  },
  textWrapper: {
    display: 'flex',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'left',
    height: 40,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: '300',
    textAlign: 'left',
    height: 35,
  },
  icon: {
    maxWidth: '30%',
    aspectRatio: 1,
  },
  buttonbar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  abs_version: {
    position: 'absolute',
    color: colors.text,
    top: 10,
    right: 10,
    fontSize: 17,
    // fontWeight: '250',
  },
  abs_buttonbar: {
    position: 'absolute',
    bottom: -50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
