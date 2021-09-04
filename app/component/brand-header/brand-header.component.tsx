import React from 'react';
import {Image, Text, View} from 'react-native';
import {Common} from '../../constant/common.constant';
import {Images} from '../../constant/images.constant';
import {styles} from './brand-header.style';

export default class BrandHeader extends React.Component {
  render() {
    return (
      <View style={styles.brandHeaderContainer}>
        <Image source={Images.BRLogo} style={styles.leftLogo}></Image>
        <Text style={styles.brandHeaderAppName}>{Common.App.name}</Text>
      </View>
    );
  }
}
