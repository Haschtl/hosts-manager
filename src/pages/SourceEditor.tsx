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
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {IsDarkMode} from '../styles/styles';
import colors from '../styles/colors';
import CheckBox from '@react-native-community/checkbox';
import {HostsCategory} from '../hosts_manager';
import * as actions from '../store/actions';
import HostsFileEditor from '../components/HostsFileEditor';
import {SwitchStyled, TextInputStyled} from '../components/Inputs';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;
type OwnProps = {};
const SourceEditor: React.FC<Props> = ({
  route,
  navigation,
  rmHostCategory,
  setHostCategory,
  addHostCategory,
}) => {
  const isDarkMode = IsDarkMode();
  const {source, idx} = route?.params as {source: HostsCategory; idx: number};
  let [category, setCategory] = React.useState<HostsCategory>(source);
  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };
  let onSave = () => {
    if (idx < 0) {
      addHostCategory(category);
    } else {
      setHostCategory(idx, category);
    }
    navigation.navigate('sources');
  };
  let onRemove = () => {
    rmHostCategory(idx);
    navigation.navigate('sources');
  };
  let onLabelChange = (value: string) => {
    setCategory({...category, label: value});
  };
  let onTypeChange = (value: boolean) => {
    setCategory({...category, type: !value ? 'file' : 'url'});
  };
  let onFormatChange = (value: boolean) => {
    setCategory({...category, format: !value ? 'allow' : 'block'});
  };
  let onLocationChange = (value: string) => {
    setCategory({...category, location: value});
  };
  let onApplyRedirectsChange = () => {
    setCategory({...category, applyRedirects: !category.applyRedirects});
  };
  return (
    <View style={backgroundStyle}>
      <SourceEditorHeader
        navigation={navigation}
        onSave={onSave}
        onRemove={onRemove}
      />
      <ScrollView style={sourceStyle.wrapper}>
        <TextInputStyled
          label={'Label'}
          value={category?.label}
          onChangeText={onLabelChange}
        />
        <SwitchStyled
          label={'List format'}
          value={category?.format === 'block'}
          trueLabel="BLOCK"
          falseLabel="ALLOW"
          onChange={onFormatChange}
        />
        <SwitchStyled
          label={'Type'}
          value={category?.type === 'url'}
          trueLabel="URL"
          falseLabel="FILE"
          onChange={onTypeChange}
        />
        {category?.type === 'url' ? (
          <>
            <TextInputStyled
              label={'Location'}
              value={category?.location}
              onChangeText={onLocationChange}
            />
            <View style={sourceStyle.checkBox}>
              <CheckBox onChange={onApplyRedirectsChange} />
              <Text>Apply redirected hosts</Text>
            </View>
            <Text style={sourceStyle.info}>
              Allowing redirected hosts may cause security issues. Only use this
              on a trusted source as it could redirect some sensitive traffic to
              whatever server it wants
            </Text>
          </>
        ) : (
          <HostsFileEditor
            category={source}
            navigation={navigation}
            showAddButton={true}
            editable={true}
          />
        )}
      </ScrollView>
    </View>
  );
};

type HProps = {
  children?: React.ReactNode;
  onSave(): void;
  onRemove(): void;
} & ScreenComponentType;
let SourceEditorHeader: React.FC<HProps> = ({navigation, onSave, onRemove}) => {
  return (
    <Header navigation={navigation} backPage={'sources'}>
      <Text style={headerStyle.text}>Edit source</Text>
      <View style={headerStyle.buttonwrapper}>
        <TouchableOpacity onPress={onRemove}>
          <Image
            style={{margin: 10}}
            source={require('../drawable/outline_delete_24.svg')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onSave}>
          <Image
            style={{margin: 10}}
            source={require('../drawable/baseline_check_24.svg')}
          />
        </TouchableOpacity>
      </View>
    </Header>
  );
};
const mapDispatchToProps = {
  rmHostCategory: actions.rmHostCategory,
  addHostCategory: actions.addHostCategory,
  setHostCategory: actions.setHostCategory,
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceEditor);

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
