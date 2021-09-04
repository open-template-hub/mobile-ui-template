import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {styles} from './app-header.style';
import {Common} from '../../constant/common.constant';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {DrawerActions} from '@react-navigation/native';
import {MenuStyle} from '../../enum/menu-style.enum';
import {Images} from '../../constant/images.constant';
import {Theme} from '../../constant/theme.constant';
import {Logger} from '../../util/logger.util';
import {LogSeverity} from '../../enum/log-severity.enum';

interface Props {
  navigation: any;
}

export default class AppHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  toggleDrawer = () => {
    const {navigation} = this.props;
    try {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error on Toggle Drawer: ',
        args: e,
        callerInstance: this,
        callerMethod: 'toggleDrawer',
      });
    }
  };

  render() {
    return (
      <View style={styles.appHeaderContainer}>
        {Theme.Menu.style === MenuStyle.Left ? (
          <TouchableOpacity
            style={styles.leftMenuButton}
            onPress={() => {
              this.toggleDrawer();
            }}>
            <View>
              <FontAwesomeIcon icon={faBars} size={22} color="#212121" />
            </View>
          </TouchableOpacity>
        ) : (
          <Image source={Images.BRLogo} style={styles.leftLogo}></Image>
        )}

        <Text style={styles.appNameText}>{Common.App.name}</Text>
      </View>
    );
  }
}
