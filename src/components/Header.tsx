import * as React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../styles/colors';
import {ScreenComponentType} from '../App';

type Props = {
  children?: React.ReactNode;
  backPage?: string;
} & ScreenComponentType;
export let Header: React.FC<Props> = ({
  navigation,
  children,
  backPage = 'start',
}) => {
  let goBack = () => {
    navigation.navigate(backPage);
  };
  return (
    <View style={headerStyle.wrapper}>
      <TouchableOpacity onPress={goBack}>
        <Image
          style={{margin: 10}}
          source={require('../drawable/baseline_arrow_left.svg')}
        />
      </TouchableOpacity>
      {children}
    </View>
  );
};
export const headerStyle = StyleSheet.create({
  wrapper: {
    height: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    padding: 4,
    backgroundColor: colors.black,
  },
  buttonwrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'left',
    width: '70%',
    paddingLeft: 20,
  },
});
