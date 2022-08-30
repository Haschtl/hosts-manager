import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../styles/colors';

type IProps = {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};
export let TextInputStyled: React.FC<IProps> = ({
  label,
  value,
  onChangeText,
}) => {
  return (
    <View style={inputStyle.wrapper}>
      <Text style={inputStyle.label}>{label}</Text>
      <TextInput
        style={inputStyle.input}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

type SProps = {
  label?: string;
  value?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  onChange?: (value: boolean) => void;
};
export let SwitchStyled: React.FC<SProps> = ({
  label,
  value,
  trueLabel,
  falseLabel,
  onChange,
}) => {
  return (
    <View style={switchStyle.wrapper}>
      <Text style={switchStyle.label}>{label}</Text>
      <View style={switchStyle.buttons}>
        <TouchableOpacity
          onPress={() => onChange && onChange(true)}
          style={[
            switchStyle.button,
            switchStyle.buttonLeft,
            value ? switchStyle.buttonActive : switchStyle.buttonInactive,
          ]}>
          <Text>{trueLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            switchStyle.button,
            switchStyle.buttonRight,
            value ? switchStyle.buttonInactive : switchStyle.buttonActive,
          ]}
          onPress={() => onChange && onChange(false)}>
          <Text>{falseLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const switchStyle = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  label: {},
  buttons: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonActive: {
    borderColor: colors.primary80,
    borderWidth: 2,
    backgroundColor: colors.primary40,
  },
  buttonInactive: {
    borderColor: colors.dark,
    borderWidth: 1,
  },
  buttonLeft: {borderTopLeftRadius: 5, borderBottomLeftRadius: 5},
  buttonRight: {borderTopRightRadius: 5, borderBottomRightRadius: 5},
  button: {
    color: colors.text,
    paddingTop: 10,
    width: 80,
    paddingBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const inputStyle = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.darker,
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    padding: 10,
    borderColor: colors.dark,
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  label: {fontSize: 12, color: colors.text},
  input: {backgroundColor: 'transparent', borderWidth: 0, height: 30},
});
