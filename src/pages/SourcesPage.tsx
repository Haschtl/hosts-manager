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
import * as actions from '../store/actions';
import SourceListElement from '../components/SourceListElement';
import {HostsCategory} from '../hosts_manager';
import {listStyle} from '../components/HostsFileEditor';

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
  let addSource = () => {
    navigation.navigate('editsource', {
      source: {
        enabled: true,
        label: '',
        format: 'block',
        type: 'url',
        content: [],
        applyRedirects: false,
      } as HostsCategory,
      idx: -1,
    });
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
            idx={idx}
            navigation={navigation}
            key={'category' + idx}
          />
        ))}
      </ScrollView>
      <TouchableOpacity style={listStyle.addbutton} onPress={addSource}>
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

export const sourcesStyle = StyleSheet.create({
  list: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    // padding: 10,
    margin: 10,
  },
});
