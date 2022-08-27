import React, {useState} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Animated} from 'react-native-windows';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ScreenComponentType} from '../App';
import * as actions from '../store/actions';
import {State} from '../store/types';
// import SvgUri from 'react-native-svg-uri';
import colors from '../styles/colors';
// import {IsDarkMode} from '../styles/styles';

type Props = {
  active: boolean;
  setActive(v: boolean): void;
} & ScreenComponentType;
const Footer: React.FC<Props> = ({navigation, active, setActive}) => {
  const navigate = (v: string) => {
    navigation.navigate(v);
    setValue(0);
  };
  let [menu] = useState(new Animated.Value(0));
  //   let menu = new Animated.Value(0);
  let [current, setCurrent] = useState(0);
  let onPress = () => setValue();
  let setValue = (v?: number) => {
    if (v === undefined) {
      v = current;
    }
    if (current === 1) {
      v = 0;
    } else {
      v = 1;
    }
    setCurrent(v);
    Animated.timing(menu, {
      toValue: v,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  return (
    <>
      <Animated.View
        style={[
          footerStyle.menu,
          {
            transform: [
              {
                translateY: menu.interpolate({
                  inputRange: [0, 1],
                  outputRange: [180, 0],
                }),
              },
            ],
          },
        ]}>
        <TouchableOpacity
          style={footerStyle.menuEntry}
          onPress={() => navigate('start')}>
          <Image source={require('../drawable/baseline_favorite_24.svg')} />
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={footerStyle.menuEntry}
          onPress={() => navigate('sources')}>
          <Image source={require('../drawable/ic_outline_rule_24.svg')} />
          <Text>Sources</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={footerStyle.menuEntry}
          onPress={() => navigate('list')}>
          <Image source={require('../drawable/ic_list_red.svg')} />
          <Text>Lists</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={footerStyle.menuEntry}
          onPress={() => navigate('support')}>
          <Image source={require('../drawable/ic_github_24dp.svg')} />
          <Text>Github project</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={footerStyle.menuEntry}
          onPress={() => navigate('settings')}>
          <Image source={require('../drawable/ic_settings_24dp.svg')} />
          <Text>Options</Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={footerStyle.wrapper}>
        <TouchableOpacity style={{marginLeft: 10}} onPress={onPress}>
          <Image source={require('../drawable/ic_menu_24dp.svg')} />
        </TouchableOpacity>
        <View style={footerStyle.center}>
          <TouchableHighlight
            style={[
              footerStyle.statebutton,
              active
                ? {backgroundColor: colors.primary}
                : {backgroundColor: colors.dark},
            ]}
            // activeOpacity={0.2}

            onPress={() => setActive(!active)}
            // underlayColor={'#000000'}
          >
            {active ? (
              <Image source={require('../drawable/ic_pause_24dp.svg')} />
            ) : (
              <Image source={require('../drawable/ic_record_24dp.svg')} />
            )}
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};
const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({setActive: actions.setActive}, dispatch);
const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(Footer);

const footerStyle = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.dark,
    bottom: 50,
    padding: 5,
  },
  menuEntry: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    marginTop: 25,
    // paddingLeft: 10,
    // paddingRight:10,
    display: 'flex',
    // flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 4,
    backgroundColor: colors.darker,
  },
  center: {
    position: 'absolute',
    top: -30,
    left: '50%',
    // display: 'flex',
    // flex: 1,
    // justifyContent: 'center',
    // alignContent: 'center',
    // width: '100%',
    transform: [{translateX: -25}],
  },
  statebutton: {
    borderColor: colors.black,
    borderWidth: 5,
    width: 60,
    height: 60,
    borderRadius: 30,
    display: 'flex',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
