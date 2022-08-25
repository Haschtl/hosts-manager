import type {Node} from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  Image,
  View,
  Button,
} from 'react-native';
import React from 'react';
import colors from './colors';

export const Header = (): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (<>
    <View style={styles.background}>
      <Image
        style={styles.icon}
        accessibilityRole="image"
        source={require('./icon_foreground.png')}></Image>
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.title,
            {
              color: colors.white,
            },
          ]}>
          AdAway (Win)
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.white,
            },
          ]}>
          Open Source ad blocker
        </Text>
      </View>
      <View style={styles.buttonbar}>
        <Button title="Blocked"></Button>
        <Button title="Allowed"></Button>
        <Button title="Redirected"></Button>
      </View>
    </View>
      </>
  );
};

const styles = StyleSheet.create({
  background: {
    paddingBottom: 20,
    backgroundColor: colors.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30
  },
  textWrapper:{
    display:"flex",
    alignContent:"flex-start",
    justifyContent:"flex-start"
  },
  title: {
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'left',
    height:40
  },
  subtitle: {
    fontSize: 25,
    fontWeight: '300',
    textAlign: 'left',
    height:35
  },
  icon: {
    maxWidth: '30%',
    aspectRatio: 1,
  },
  buttonbar:{
    position:"absolute",
    bottom:-20,
    width:"100%",
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-evenly",
  }
});
