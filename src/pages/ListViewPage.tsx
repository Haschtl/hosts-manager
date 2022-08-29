import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import {IsDarkMode} from '../styles/styles';
import CheckBox from '@react-native-community/checkbox';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {Hosts, HostsLine} from '../hosts_manager';
import * as actions from '../store/actions';

type RProps = {
  lines: HostsLine[];
};
let HostsList: React.FC<RProps> = ({lines}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <FlatList
        data={lines}
        renderItem={i => <ListElement line={i.item} key={i.index} />}
        // contentInsetAdjustmentBehavior="automatic"
        style={listStyle.wrapper}
      />
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_add_black_24px.svg')} />
      </TouchableOpacity>
    </View>
  );
};

type EProps = {
  line: HostsLine;
};
let ListElement: React.FC<EProps> = ({line}) => {
  return (
    <View style={listStyle.element}>
      <CheckBox value={line.enabled} />
      <Text style={listStyle.text}>{line.domain}</Text>
      <Text style={listStyle.host}>{line.host}</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({navigation, hosts}) => {
  let sorted = sortHosts(hosts);
  let Blocked = (props: any) => {
    return HostsList({...props, lines: sorted.blocked});
  };
  let Allowed = (props: any) => {
    return HostsList({...props, lines: sorted.allowed});
  };
  let Redirected = (props: any) => {
    return HostsList({...props, lines: sorted.redirected});
  };
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: () => {
          //   let iconName;

          //   if (route.name === 'Home') {
          //     iconName = focused
          //       ? 'ios-information-circle'
          //       : 'ios-information-circle-outline';
          //   } else if (route.name === 'Settings') {
          //     iconName = focused ? 'ios-list-box' : 'ios-list';
          //   }

          // You can return any component that you like here!
          if (route.name === 'Blocked') {
            return (
              <Image source={require('../drawable/baseline_block_24.svg')} />
            );
          } else if (route.name === 'Allowed') {
            return (
              <Image source={require('../drawable/baseline_check_24.svg')} />
            );
          } else if (route.name === 'Redirect') {
            return (
              <Image
                source={require('../drawable/baseline_compare_arrows_24.svg')}
              />
            );
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarActiveBackgroundColor: colors.black,
        tabBarInactiveBackgroundColor: colors.darker,
        tabBarStyle: {borderTopWidth: 1, borderColor: colors.dark},
        header: p => <ListHeader props={p} navigation={navigation} />,
      })}>
      <Tab.Screen name="Blocked" component={Blocked} />
      <Tab.Screen name="Allowed" component={Allowed} />
      <Tab.Screen name="Redirect" component={Redirected} />
    </Tab.Navigator>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {active: state.app.active, hosts: state.app.hosts};
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewPage);

type HProps = {
  props: BottomTabHeaderProps;
  children?: React.ReactNode;
} & ScreenComponentType;
let ListHeader: React.FC<HProps> = ({props, navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>{props.route.name}</Text>
      <View style={headerStyle.buttonwrapper}>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/baseline_search_24.svg')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/ic_collections_bookmark_24dp.svg')}
          />
        </TouchableOpacity>
      </View>
    </Header>
  );
};
export const listStyle = StyleSheet.create({
  text: {
    fontSize: 20,
    height: 30,
    fontWeight: '300',
    textAlignVertical: 'center',
  },
  host: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    fontSize: 12,
    height: 30,
    color: colors.text,
    fontWeight: '200',
    textAlignVertical: 'center',
  },
  element: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  addbutton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
});

export let sortHosts = (hosts: Hosts) => {
  let blocked: HostsLine[] = [];
  let allowed: HostsLine[] = [];
  let redirected: HostsLine[] = [];
  hosts.categories.forEach(v => {
    v.content.forEach(l => {
      if (l.host !== undefined) {
        if (['127.0.0.1', '0.0.0.0'].includes(l.host)) {
          if (v.format === 'allow') {
            allowed.push(l);
          } else {
            blocked.push(l);
          }
        } else {
          redirected.push(l);
        }
      }
    });
  });
  return {blocked, allowed, redirected};
};
