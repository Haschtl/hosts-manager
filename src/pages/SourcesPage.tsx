import * as React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScreenComponentType} from '../App';
import {Header, headerStyle} from '../components/Header';
// import {Footer} from '../components/Footer';

import {connect} from 'react-redux';
import {State} from '../store/types';

const SourcesPage: React.FC<ScreenComponentType> = ({navigation}) => {
  return <SourcesHeader navigation={navigation} />;
};

type Props = {
  children?: React.ReactNode;
} & ScreenComponentType;
let SourcesHeader: React.FC<Props> = ({navigation}) => {
  return (
    <Header navigation={navigation}>
      <Text style={headerStyle.text}>Sources</Text>
      <View style={headerStyle.buttonwrapper}>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/baseline_search_24.svg')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={{margin: 10}}
            source={require('../drawable/ic_collections_bookmark_24dp.svg')}
          />
        </TouchableOpacity>
      </View>
    </Header>
  );
};

const mapStateToProps = (state: State) => {
  return {active: state.app.active};
};
export default connect(mapStateToProps)(SourcesPage);
