import * as React from 'react';
import {Text, View, ViewStyle} from 'react-native';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
// import {Footer} from '../components/Footer';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {IsDarkMode} from '../styles/styles';
import colors from '../styles/colors';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const HelpPage: React.FC<Props> = ({navigation}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <HelpHeader navigation={navigation} />
    </View>
  );
};

type HProps = {
  children?: React.ReactNode;
} & ScreenComponentType;
let HelpHeader: React.FC<HProps> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>Help</Text>
      <View style={headerStyle.buttonwrapper}></View>
    </Header>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(HelpPage);
