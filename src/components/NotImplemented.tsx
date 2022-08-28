import * as React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import colors from '../styles/colors';
import {Popup} from 'react-native-windows';

type Props = {isOpen?: boolean; onDismiss(): void};
export let NotImplemented: React.FC<Props> = ({isOpen, onDismiss}) => {
  return (
    <Popup
      isOpen={isOpen}
      isLightDismissEnabled={true}
      onDismiss={() => {
        onDismiss();
      }}>
      <View
        style={{
          backgroundColor: '#322',
          flex: 1,
          padding: 50,
          paddingBottom: 0,
          borderRadius: 20,
          display: 'flex',
          justifyContent: 'space-evenly',
          alignContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text>This feature is not implemented</Text>
        <TouchableHighlight
          onPress={() => {
            onDismiss();
          }}
          activeOpacity={0.2}
          underlayColor={colors.primary40}
          style={{
            width: 80,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <Text>Close</Text>
        </TouchableHighlight>
      </View>
    </Popup>
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
    width: '100%',
    paddingLeft: 20,
  },
});
