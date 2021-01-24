import React from 'react';
import {View} from 'react-native';
import {Wave} from 'react-native-animated-spinkit';
import {styles} from './loading.style';

export default class Loading extends React.Component {
  render() {
    return (
      <View style={styles.loading}>
        <Wave size={48} color="#FBC02D" />
      </View>
    );
  }
}
