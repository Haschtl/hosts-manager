import * as React from 'react';
import {
  Image,
  ScrollView,
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
import {HostsCategory} from '../hosts_manager';
import * as actions from '../store/actions';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;

const SourcesPage: React.FC<Props> = ({navigation, hosts}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  // let sources: HostsCategory[] = [
  //   {
  //     enabled: true,
  //     label: 'AdAway official hosts',
  //     format: 'block',
  //     type: 'url',
  //     location: 'https://adaway.org/hosts.txt',
  //     content: [],
  //     applyRedirects: false,
  //   },
  //   {
  //     enabled: true,
  //     label: 'StevenBlack Unified hosts',
  //     format: 'block',
  //     type: 'url',
  //     location:
  //       'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
  //     content: [],
  //     applyRedirects: false,
  //   },
  // ];
  return (
    <View style={backgroundStyle}>
      <SourcesHeader navigation={navigation} />
      <ScrollView style={sourcesStyle.list}>
        {hosts.categories.map((s, idx) => (
          <SourceListElement
            source={s}
            navigation={navigation}
            key={'category' + idx}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_add_black_24px.svg')} />
      </TouchableOpacity>
    </View>
  );
};

// const mapDispatchToProps = (dispatch: any) =>
//   bindActionCreators({setState: actions.setState}, dispatch);
const mapDispatchToProps = {
  setState: actions.setState,
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active, hosts: state.app.hosts};
};
export default connect(mapStateToProps, mapDispatchToProps)(SourcesPage);

type HProps = {
  children?: React.ReactNode;
} & ScreenComponentType;
let SourcesHeader: React.FC<HProps> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>Hosts-Sources</Text>
      <View style={headerStyle.buttonwrapper}></View>
    </Header>
  );
};

type SLEProps = ScreenComponentType & {
  source: HostsCategory;
};
let SourceListElement: React.FC<SLEProps> = ({source, navigation}) => {
  let onPress = () => {
    navigation.navigate('editsource');
  };
  return (
    <TouchableOpacity style={sourcesStyle.element} onPress={onPress}>
      <CheckBox style={{margin: 10}} value={source.enabled} />
      <View style={sourcesStyle.content}>
        <Text style={sourcesStyle.title}>{source.label}</Text>
        <Text style={sourcesStyle.subtitle}>{source.location}</Text>
        <Text style={sourcesStyle.subsubtitle}>Since 3 days up to date</Text>
      </View>
      <Text style={sourcesStyle.fixed}>
        {numFormatter(source.content.length)} hosts
      </Text>
    </TouchableOpacity>
  );
};

export const sourcesStyle = StyleSheet.create({
  list: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    // padding: 10,
    margin: 10,
  },
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

let numFormatter = (num: number) => {
  if (num < 1000) {
    return num + '';
  } else {
    return (num / 1000).toFixed(0) + 'k';
  }
};
