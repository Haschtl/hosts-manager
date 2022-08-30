import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {ScreenComponentType} from '../App';
import {connect} from 'react-redux';
import {State} from '../store/types';
import {HostsCategory, HostsLine} from '../hosts_manager';
import colors from '../styles/colors';
import {Popup} from 'react-native-windows';
import HostLineEditor from './HostLineEditor';
import * as actions from '../store/actions';

type Props = ScreenComponentType &
  typeof mapDispatchToProps &
  ReturnType<typeof mapStateToProps> &
  OwnProps;

type OwnProps = {
  idx: number;
  line: HostsLine;
  category: HostsCategory;
  editable?: boolean;
};
let ListViewElement: React.FC<Props> = ({
  line,
  idx,
  category,
  rmHostsLine,
  setHostsLine,
  editable,
}) => {
  let [isOpen, setIsOpen] = React.useState(false);
  let openPopup = () => {
    if (editable) {
      setIsOpen(true);
    }
  };
  let onSave = (_line: HostsLine) => {
    setHostsLine(category, idx, _line);
    setIsOpen(false);
  };
  let onRemove = () => {
    rmHostsLine(category, idx);
    setIsOpen(false);
  };
  let onDismiss = () => setIsOpen(false);
  return (
    <TouchableOpacity style={listStyle.element} onPress={openPopup}>
      <Popup
        isOpen={isOpen}
        isLightDismissEnabled={true}
        onDismiss={() => {
          onDismiss();
        }}>
        <HostLineEditor
          line={line}
          onDismiss={onDismiss}
          onSave={onSave}
          onRemove={onRemove}
        />
      </Popup>
      <CheckBox value={line.enabled} />
      <Text style={listStyle.text}>{line.domain}</Text>
      <Text style={listStyle.host}>{line.host}</Text>
    </TouchableOpacity>
  );
};

const mapDispatchToProps = {
  rmHostsLine: actions.rmHostsLine,
  setHostsLine: actions.setHostsLine,
};

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    active: state.app.active,
    hosts: state.app.hosts,
    // line: state.app.hosts.categories,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ListViewElement);

export const listStyle = StyleSheet.create({
  popup: {
    // width: '50%',
    // height: '50%',
    backgroundColor: colors.dark,
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
