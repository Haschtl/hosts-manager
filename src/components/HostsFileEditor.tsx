import * as React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import colors from '../styles/colors';
import {IsDarkMode} from '../styles/styles';
import {ScreenComponentType} from '../App';
import {HostsCategory} from '../hosts_manager';
// import * as actions from '../store/actions';
import ListViewElement from '../components/ListViewElement';

type Props = {
  category: HostsCategory;
  showAddButton?: boolean;
  editable?: boolean;
} & ScreenComponentType;
let HostsFileEditor: React.FC<Props> = ({
  category,
  navigation,
  showAddButton = false,
  editable = false,
}) => {
  const isDarkMode = IsDarkMode();

  const backgroundStyle: ViewStyle = {
    backgroundColor: isDarkMode ? colors.black : colors.lighter,
    display: 'flex',
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      <FlatList
        data={category.content}
        renderItem={i => (
          <ListViewElement
            line={i.item}
            idx={i.index}
            key={i.index}
            navigation={navigation}
            category={category}
            editable={editable}
          />
        )}
        // contentInsetAdjustmentBehavior="automatic"
        style={listStyle.wrapper}
      />
      {showAddButton && (
        <TouchableOpacity style={listStyle.addbutton}>
          <Image source={require('../drawable/ic_add_black_24px.svg')} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HostsFileEditor;

export const listStyle = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  addbutton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
});
