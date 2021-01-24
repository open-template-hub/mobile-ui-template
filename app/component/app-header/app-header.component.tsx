import React from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from './app-header.style';
import {Common} from '../../constant/common.constant';
import {TouchableOpacity} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {DrawerActions} from '@react-navigation/native';
import {MenuStyle} from '../../enum/menu-style.enum';
import {Images} from '../../constant/images.constant';
import {Theme} from '../../constant/theme.constant';

interface Props {
  navigation: any;
}

export default class AppHeader extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  toggleDrawer = () => {
    const {navigation} = this.props;
    try {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch (e) {
      console.log('Error on Toggle Drawer: ', e);
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
