import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Image} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {HostsLine} from '../hosts_manager';
import colors from '../styles/colors';
import {TextInputStyled} from './Inputs';

type Props = typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  line: HostsLine;
  onSave(line: HostsLine): void;
  onRemove(line: HostsLine): void;
  onDismiss(): void;
};
let HostLineEditor: React.FC<Props> = ({line, onSave, onDismiss, onRemove}) => {
  let [current, setCurrent] = React.useState<HostsLine>(line);
  let onDomainChange = (text: string) => {
    setCurrent({...current, domain: text});
  };
  let onHostChange = (text: string) => {
    setCurrent({...current, host: text});
  };
  let onCommentChange = (text: string) => {
    setCurrent({...current, comment: text});
  };
  let toggleEnabled = () => {
    setCurrent({...current, enabled: !current.enabled});
  };
  let _onSave = () => {
    onSave(current);
  };
  let _onRemove = () => {
    onRemove(current);
  };
  console.log(line, current);
  return (
    <View style={style.wrapper}>
      <View style={style.buttonbar}>
        <TouchableOpacity style={style.iconWrapper} onPress={onDismiss}>
          <Image
            style={style.icon}
            source={require('../drawable/baseline_arrow_left.svg')}
          />
        </TouchableOpacity>
        <View style={style.buttonbar2}>
          <TouchableOpacity style={style.iconWrapper} onPress={_onRemove}>
            <Image
              style={style.icon}
              source={require('../drawable/outline_delete_24.svg')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={style.iconWrapper} onPress={_onSave}>
            <Image
              style={style.icon}
              source={require('../drawable/baseline_check_24.svg')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInputStyled
        label={'Domain'}
        value={current.domain}
        onChangeText={onDomainChange}
      />
      <TextInputStyled
        label={'Host'}
        value={current.host}
        onChangeText={onHostChange}
      />
      <TextInputStyled
        label={'Comment'}
        value={current.comment}
        onChangeText={onCommentChange}
      />
      <View style={style.element}>
        <CheckBox value={current.enabled} onChange={toggleEnabled} />
        <Text style={style.text}>Enabled</Text>
      </View>
    </View>
  );
};
const mapDispatchToProps = {};

const mapStateToProps = (state: State) => {
  return {active: state.app.active, hosts: state.app.hosts};
};
export default connect(mapStateToProps, mapDispatchToProps)(HostLineEditor);

export const style = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.dark,
    width: 400,
    height: 400,
    borderRadius: 20,
  },
  iconWrapper: {},
  icon: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonbar: {
    // padding: 20,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  buttonbar2: {
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    fontSize: 20,
    height: 30,
    fontWeight: '300',
    textAlignVertical: 'center',
  },
  host: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    fontSize: 12,
    height: 30,
    color: colors.text,
    fontWeight: '200',
    textAlignVertical: 'center',
  },
  element: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignContent: 'center',
  },
});
