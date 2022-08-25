import React from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import colors from '../styles/colors';
// import {IsDarkMode} from '../styles/styles';

export const StartPage: React.FC = () => {
  return (
    <View>
      <Header />
      <Text>gg</Text>
    </View>
  );
};

export const Header: React.FC = () => {
  return (
    <>
      <View style={headerStyles.background}>
        <Image
          style={headerStyles.icon}
          accessibilityRole="image"
          source={require('../drawable/icon_foreground.png')}
        />
        <View style={headerStyles.textWrapper}>
          <Text
            style={[
              headerStyles.title,
              {
                color: colors.white,
              },
            ]}>
            AdAway (Win)
          </Text>
          <Text
            style={[
              headerStyles.subtitle,
              {
                color: colors.white,
              },
            ]}>
            Open Source ad blocker
          </Text>
        </View>
        <View style={headerStyles.buttonbar}>
          <HeaderButton
            title="Blocked"
            icon="./drawable/baseline_block_24.svg"
          />
          <HeaderButton
            title="Allowed"
            icon="./drawable/baseline_check_24.svg"
          />
          <HeaderButton
            title="Redirected"
            icon="./drawable/baseline_compare_arrows_24.svg"
          />
        </View>
      </View>
    </>
  );
};

interface HBProps {
  title: string;
  icon?: string;
}
export const HeaderButton: React.FC<HBProps> = ({title, icon}) => {
  return (
    <TouchableOpacity
      style={{
        height: 40,
        width: 150,
        backgroundColor: colors.darker,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => {}}
      activeOpacity={0.5}>
      <Text style={{color: colors.white}}>{title}</Text>
      {icon !== undefined ? (
        <SvgUri
          width="200"
          height="200"
          source={require('../drawable/baseline_compare_arrows_24.svg')}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const headerStyles = StyleSheet.create({
  background: {
    paddingBottom: 20,
    backgroundColor: colors.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  textWrapper: {
    display: 'flex',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'left',
    height: 40,
  },
  subtitle: {
    fontSize: 25,
    fontWeight: '300',
    textAlign: 'left',
    height: 35,
  },
  icon: {
    maxWidth: '30%',
    aspectRatio: 1,
  },
  buttonbar: {
    position: 'absolute',
    bottom: -20,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
