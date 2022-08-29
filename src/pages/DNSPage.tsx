import * as React from 'react';
import {Image, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
// import {Footer} from '../components/Footer';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {listStyle} from './ListViewPage';
import {IsDarkMode} from '../styles/styles';
import colors from '../styles/colors';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const DNSPage: React.FC<Props> = ({navigation}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <DNSHeader navigation={navigation} />
      <Text>
        Press record to start logging requests, browse the Web or use apps, then
        go back or swipe to refresh the logs.
      </Text>
      <Text>
        Blocked requests will not be logged. Disable ad-blocking first if you
        want to log them too.
      </Text>
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_record_24dp.svg')} />
      </TouchableOpacity>
    </View>
  );
};

type HProps = {
  children?: React.ReactNode;
} & ScreenComponentType;
let DNSHeader: React.FC<HProps> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>DNS-Requests</Text>
      <View style={headerStyle.buttonwrapper}>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/baseline_sort_by_alpha_24.svg')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/outline_delete_24.svg')}
          />
        </TouchableOpacity>
      </View>
    </Header>
  );
};

const mapDispatchToProps = {};
const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(DNSPage);
