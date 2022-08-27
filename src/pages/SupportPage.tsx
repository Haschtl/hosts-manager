import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
// import SvgUri from 'react-native-svg-uri';
import colors from '../styles/colors';
import Footer from '../components/Footer';
import {ScreenComponentType} from '../App';
import {connect} from 'react-redux';
import {State} from '../store/types';
// import {IsDarkMode} from '../styles/styles';

const SupportPage: React.FC<ScreenComponentType> = ({navigation}) => {
  const pageStyle: ViewStyle = {
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={pageStyle}>
      <View style={versionStyles.background}>
        <View style={versionStyles.textWrapper}>
          <Image
            style={versionStyles.icon}
            accessibilityRole="image"
            source={require('../drawable/icon_foreground.png')}
          />
          <Text style={versionStyles.title}>You are up to date</Text>
        </View>
        <View style={versionStyles.changelog}>
          <Text
            style={[
              versionStyles.subtitle,
              {
                color: colors.white,
              },
            ]}>
            Latest changes
          </Text>
          <Text style={versionStyles.change}>- Fix hosts file install</Text>
          <Text style={[versionStyles.subtitle, {marginTop: 20}]}>
            Support development
          </Text>
          <View style={versionStyles.buttonbar}>
            <TouchableOpacity style={versionStyles.supportButton}>
              <Image
                style={{width: 20}}
                source={require('../drawable/paypal.svg')}
              />
              <Text style={{marginLeft: 5}}>Spenden</Text>
            </TouchableOpacity>
            <TouchableOpacity style={versionStyles.supportButton}>
              <Image
                style={{width: 20}}
                source={require('../drawable/ic_github_24dp.svg')}
              />
              <Text style={{marginLeft: 5}}>Sponsor</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps)(SupportPage);

const versionStyles = StyleSheet.create({
  background: {
    // paddingTop: 40,
    backgroundColor: colors.primary,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
  },
  textWrapper: {
    display: 'flex',
    // flex: 1,
    // width: '100%',
    height: '40%',
    flexDirection: 'column',
    // alignContent: 'flex-start',
    alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'left',
    // height: 40,
    color: colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'left',
    height: 35,
  },
  change: {
    fontSize: 17,
    fontWeight: '200',
    color: colors.text,
    textAlign: 'left',
  },

  icon: {
    // width: "10%",
    height: '50%',
    aspectRatio: 1,
  },
  changelog: {
    marginLeft: 25,
    marginRight: 25,
    display: 'flex',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
  },
  buttonbar: {
    margin: 5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  supportButton: {
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    borderColor: colors.white,
    borderRadius: 3,
    borderWidth: 2,
  },
});
