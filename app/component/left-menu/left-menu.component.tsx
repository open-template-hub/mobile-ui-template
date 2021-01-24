import React from 'react';
import {View} from 'react-native';
import {styles} from './left-menu.style';

interface Props {
  navigation: any;
}

export default class AppLeftMenu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return <View style={styles.appLeftMenu}></View>;
  }
}
