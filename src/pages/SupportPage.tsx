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

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const SupportPage: React.FC<Props> = ({navigation}) => {
  const pageStyle: ViewStyle = {
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={pageStyle}>
      <View style={supportStyles.background}>
        <View style={supportStyles.textWrapper}>
          <Image
            style={supportStyles.icon}
            accessibilityRole="image"
            source={require('../drawable/baseline_favorite_24.svg')}
          />
          <Text style={supportStyles.title}>Support Me!</Text>
        </View>
        <View style={supportStyles.changelog}>
          <Text style={supportStyles.text}>
            This is a free and open-source application. I develop it in my free
            time. If you like it, please support me:
          </Text>
          <View style={supportStyles.buttonbar}>
            <TouchableOpacity style={supportStyles.supportButton}>
              <Image
                style={{width: 20}}
                source={require('../drawable/paypal.svg')}
              />
              <Text style={{marginLeft: 5}}>Spenden</Text>
            </TouchableOpacity>
            <TouchableOpacity style={supportStyles.supportButton}>
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
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(SupportPage);

const supportStyles = StyleSheet.create({
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
  text: {
    fontSize: 17,
    fontWeight: '200',
    color: colors.text,
    marginBottom: 40,
    textAlign: 'center',
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
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  supportButton: {
    padding: 5,
    margin: 10,
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
