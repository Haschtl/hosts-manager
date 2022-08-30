import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScreenComponentType} from '../App';
// import {Footer} from '../components/Footer';

import {connect} from 'react-redux';
import {State} from '../store/types';
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
  idx: number;
};
let SourceListElement: React.FC<Props> = ({
  source,
  navigation,
  idx,
  setHostCategory,
}) => {
  let onPress = () => {
    navigation.navigate('editsource', {
      source,
      idx,
    });
  };
  let toggleCategory = () => {
    setHostCategory(idx, {...source, enabled: !source.enabled});
  };
  return (
    <TouchableOpacity style={sourcesStyle.element} onPress={onPress}>
      <CheckBox
        style={{margin: 10}}
        value={source.enabled}
        onChange={toggleCategory}
      />
      <View style={sourcesStyle.content}>
        <Text style={sourcesStyle.title}>{source.label}</Text>
        <Text style={sourcesStyle.subtitle}>{source.location}</Text>
        {source.type === 'url' && (
          <Text style={sourcesStyle.subsubtitle}>Since 3 days up to date</Text>
        )}
      </View>
      <Text style={sourcesStyle.fixed}>
        {numFormatter(source.content.length)} hosts
      </Text>
    </TouchableOpacity>
  );
};

const mapDispatchToProps = {
  setState: actions.setState,
  setHostCategory: actions.setHostCategory,
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active, hosts: state.app.hosts};
};
export default connect(mapStateToProps, mapDispatchToProps)(SourceListElement);

export const sourcesStyle = StyleSheet.create({
  element: {
    width: '100%',
    backgroundColor: colors.dark,
    borderRadius: 7,
    marginBottom: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 15,
    fontWeight: '400',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '200',
  },
  subsubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  fixed: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 12,
    fontWeight: '400',
  },
});

let numFormatter = (num: number) => {
  if (num < 1000) {
    return num + '';
  } else {
    return (num / 1000).toFixed(0) + 'k';
  }
};
