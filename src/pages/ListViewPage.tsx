import * as React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
  BottomTabHeaderProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import colors from '../styles/colors';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {sortHosts} from '../hosts_manager';
// import * as actions from '../store/actions';
import HostsFileEditor from '../components/HostsFileEditor';

const Tab = createBottomTabNavigator();

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps>;
const ListViewPage: React.FC<Props> = ({navigation, hosts}) => {
  let sorted = sortHosts(hosts);
  console.log(sorted);
  let Blocked = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.blocked,
        applyRedirects: false,
        format: 'block',
        label: '',
        type: 'file',
      },
      navigation,
    });
  };
  let Allowed = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.allowed,
        applyRedirects: false,
        format: 'block',
        label: '',
        type: 'file',
      },
      navigation,
    });
  };
  let Redirected = (props: any) => {
    return HostsFileEditor({
      ...props,
      category: {
        content: sorted.redirected,
        applyRedirects: false,
        format: 'block',
        label: '',
        type: 'file',
      },
      navigation,
    });
  };
  return (
    <Tab.Navigator
      key="listroot"
      id="lists"
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
