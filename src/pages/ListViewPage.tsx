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

let AllowList: React.FC = () => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={listStyle.wrapper}>
        <ListElement />
        <ListElement />
        <ListElement />
      </ScrollView>
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_add_black_24px.svg')} />
      </TouchableOpacity>
    </View>
  );
};

let BlockedList: React.FC = () => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={listStyle.wrapper}>
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
        <ListElement />
      </ScrollView>
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_add_black_24px.svg')} />
      </TouchableOpacity>
    </View>
  );
};

let RedirectList: React.FC = () => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={listStyle.wrapper}>
        <ListElement />
        <ListElement />
        <ListElement />
      </ScrollView>
      <TouchableOpacity style={listStyle.addbutton}>
        <Image source={require('../drawable/ic_add_black_24px.svg')} />
      </TouchableOpacity>
    </View>
  );
};

let ListElement: React.FC = () => {
  return (
    <View style={listStyle.element}>
      <CheckBox />
      <Text style={listStyle.text}>blabla.de</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const ListViewPage: React.FC<ScreenComponentType> = ({navigation}) => {
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
      <Tab.Screen name="Blocked" component={BlockedList} />
      <Tab.Screen name="Allowed" component={AllowList} />
      <Tab.Screen name="Redirect" component={RedirectList} />
    </Tab.Navigator>
  );
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps)(ListViewPage);

type Props = {
  props: BottomTabHeaderProps;
  children?: React.ReactNode;
} & ScreenComponentType;
let ListHeader: React.FC<Props> = ({props, navigation}) => {
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
const listStyle = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '300',
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
