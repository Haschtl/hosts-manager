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
import {listStyle} from './ListViewPage';
import CheckBox from '@react-native-community/checkbox';

export type Source = {
  active: boolean;
  label: string;
  format: 'block' | 'allow';
  type: 'url' | 'file';
  location?: string;
  list?: string[];
  applyRedirections: boolean;
};
const SourcesPage: React.FC<ScreenComponentType> = ({navigation}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  let sources: Source[] = [
    {
      active: true,
      label: 'AdAway official hosts',
      format: 'block',
      type: 'url',
      location: 'https://adaway.org/hosts.txt',
      applyRedirections: false,
    },
    {
      active: true,
      label: 'StevenBlack Unified hosts',
      format: 'block',
      type: 'url',
      location:
        'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
      applyRedirections: false,
    },
  ];
  return (
    <View style={backgroundStyle}>
      <SourcesHeader navigation={navigation} />
      <View style={sourcesStyle.list}>
        {sources.map(s => (
          <SourceListElement source={s} navigation={navigation} />
        ))}
      </View>
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_add_black_24px.svg')} />
      </TouchableOpacity>
    </View>
  );
};

type Props = {
  children?: React.ReactNode;
} & ScreenComponentType;
let SourcesHeader: React.FC<Props> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>Hosts-Sources</Text>
      <View style={headerStyle.buttonwrapper}></View>
    </Header>
  );
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps)(SourcesPage);

type SLEProps = ScreenComponentType & {
  source: Source;
};
let SourceListElement: React.FC<SLEProps> = ({source, navigation}) => {
  let onPress = () => {
    navigation.navigate('editsource');
  };
  return (
    <TouchableOpacity style={sourcesStyle.element} onPress={onPress}>
      <CheckBox style={{margin: 10}} />
      <View style={sourcesStyle.content}>
        <Text style={sourcesStyle.title}>{source.label}</Text>
        <Text style={sourcesStyle.subtitle}>{source.location}</Text>
        <Text style={sourcesStyle.subsubtitle}>Since 3 days up to date</Text>
      </View>
      <Text style={sourcesStyle.fixed}>4k hosts</Text>
    </TouchableOpacity>
  );
};

export const sourcesStyle = StyleSheet.create({
  list: {display: 'flex', flex: 1, flexDirection: 'column', padding: 10},
  element: {
    width: '100%',
    backgroundColor: colors.dark,
    borderRadius: 7,
    marginBottom: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 15,
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '200',
  },
  subsubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  fixed: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 12,
    fontWeight: '400',
  },
});
