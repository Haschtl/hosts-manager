import * as React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
// import {Footer} from '../components/Footer';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {IsDarkMode} from '../styles/styles';
import colors from '../styles/colors';
import CheckBox from '@react-native-community/checkbox';
import {HostsCategory} from '../hosts_manager';
import * as actions from '../store/actions';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type OwnProps = {
  source: HostsCategory;
};
const SourceEditor: React.FC<Props> = ({navigation, source}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  return (
    <View style={backgroundStyle}>
      <SourceEditorHeader navigation={navigation} />
      <View style={sourceStyle.wrapper}>
        <TextInputStyled label={'Label'} value={source?.label} />
        <SwitchStyled
          label={'List format'}
          value={source?.format === 'block'}
          trueLabel="BLOCK"
          falseLabel="ALLOW"
        />
        <SwitchStyled
          label={'Type'}
          value={source?.type === 'url'}
          trueLabel="URL"
          falseLabel="FILE"
        />
        <TextInputStyled label={'Location'} value={source?.location} />
        <View style={sourceStyle.checkBox}>
          <CheckBox />
          <Text>Apply redirected hosts</Text>
        </View>
        <Text style={sourceStyle.info}>
          Allowing redirected hosts may cause security issues. Only use this on
          a trusted source as it could redirect some sensitive traffic to
          whatever server it wants
        </Text>
      </View>
    </View>
  );
};

type HProps = {
  children?: React.ReactNode;
} & ScreenComponentType;
let SourceEditorHeader: React.FC<HProps> = ({navigation}) => {
  return (
    <Header navigation={navigation} backPage={'sources'}>
      <Text style={headerStyle.text}>Edit source</Text>
      <View style={headerStyle.buttonwrapper}>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/outline_delete_24.svg')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/baseline_check_24.svg')}
          />
        </TouchableOpacity>
      </View>
    </Header>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceEditor);

type IProps = {
  label?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};
let TextInputStyled: React.FC<IProps> = ({label, value, onChangeText}) => {
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
let SwitchStyled: React.FC<SProps> = ({
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
          onPress={() => onChange && onChange(true)}>
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
  input: {backgroundColor: 'transparent', borderWidth: 0},
});

export const sourceStyle = StyleSheet.create({
  wrapper: {display: 'flex', flexDirection: 'column', margin: 15},
  checkBox: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  info: {fontSize: 12, color: colors.text},
});
