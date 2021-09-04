import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSitemap,
  faIdBadge,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import {Theme} from '../../constant/theme.constant';
import Localization from '../../localization/i18n/Localization';
import ProductListScreen from '../product-list/ProductListScreen';
import AppHeader from '../../component/app-header/app-header.component';
import ProfileScreen from '../profile/ProfileScreen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignOutScreen from '../sign-out/SignOutScreen';
import {MenuStyle} from '../../enum/menu-style.enum';
import {Storage} from '../../app.store';
import {UserPayload} from '../../interface/user-payload.interface';
import {UserController} from '../../contoller/user.controller';
import {Logger} from '../../util/logger.util';
import {LogSeverity} from '../../enum/log-severity.enum';

interface Props {
  navigation: any;
}

export default class DashboardScreen extends React.Component<Props> {
  private _Tab: any;
  private _Drawer: any;
  private _userController: UserController;

  constructor(props: any) {
    super(props);
    this._Tab = createBottomTabNavigator();
    this._Drawer = createDrawerNavigator();
    this._userController = new UserController();
  }

  componentDidMount = async () => {
    try {
      const auth = await Storage.getAuth();
      if (auth && auth.accessToken) {
        await this._userController.saveMe(auth, {
          firstName: '',
          lastName: '',
        } as UserPayload);
      }
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MINOR,
        message: 'Error on saveMe: ',
        args: e,
        callerInstance: this,
        callerMethod: 'componentDidMount',
      });
    }
  };

  renderContent = (comp: any) => {
    if (Theme.Menu.style === MenuStyle.Left) {
      return (
        <comp._Drawer.Navigator
          drawerContentOptions={{
            activeBackgroundColor: Theme.Color.defaultButtonColor,
            activeTintColor: Theme.Color.white,
            inactiveBackgroundColor: Theme.Color.white,
            inactiveTintColor: '#616161',
            itemStyle: {marginVertical: 4, marginHorizontal: 4},
            labelStyle: {
              fontSize: 12,
              fontFamily: 'NotoSansJP-Bold',
            },
          }}>
          <comp._Drawer.Screen
            name={Localization.t('profile')}
            component={ProfileScreen}
            options={{
              drawerIcon: ({color}: any) => (
                <FontAwesomeIcon icon={faIdBadge} size={20} color={color} />
              ),
            }}
          />
          <comp._Drawer.Screen
            name={Localization.t('products')}
            component={ProductListScreen}
            options={{
              drawerIcon: ({color}: any) => (
                <FontAwesomeIcon icon={faSitemap} size={20} color={color} />
              ),
            }}
          />
          <comp._Drawer.Screen
            name={Localization.t('signOut')}
            component={SignOutScreen}
            options={{
              drawerIcon: ({color}: any) => this.getSignOutIcon(color),
            }}
          />
        </comp._Drawer.Navigator>
      );
    } else if (Theme.Menu.style === MenuStyle.Tab) {
      return (
        <comp._Tab.Navigator
          tabBarOptions={{
            activeTintColor: Theme.Color.white,
            inactiveTintColor: '#616161',
            inactiveBackgroundColor: Theme.Color.white,
            labelStyle: {
              fontSize: 10,
              fontFamily: 'NotoSansJP-Bold',
            },
            tabStyle: {
              justifyContent: 'center',
              alignContent: 'center',
              borderColor: '#EEEEEE',
              borderWidth: 0.5,
              borderRadius: 3,
              paddingBottom: 7,
              paddingTop: 13,
              height: 60,
            },
            activeBackgroundColor: Theme.Color.defaultButtonColor,
          }}>
          <comp._Tab.Screen
            name={Localization.t('profile')}
            component={ProfileScreen}
            options={{
              tabBarLabel: Localization.t('profile'),
              tabBarIcon: ({color, size}: any) => (
                <FontAwesomeIcon icon={faIdBadge} size={20} color={color} />
              ),
            }}
          />
          <comp._Tab.Screen
            name={Localization.t('products')}
            component={ProductListScreen}
            options={{
              tabBarLabel: Localization.t('products'),
              tabBarIcon: ({color, size}: any) => (
                <FontAwesomeIcon icon={faSitemap} size={20} color={color} />
              ),
            }}
          />
          <comp._Tab.Screen
            name={Localization.t('signOut')}
            component={SignOutScreen}
            options={{
              tabBarLabel: Localization.t('signOut'),
              tabBarIcon: ({color, size}: any) => this.getSignOutIcon(color),
            }}
          />
        </comp._Tab.Navigator>
      );
    } else {
      return null;
    }
  };

  getSignOutIcon = (color: string) => {
    return <FontAwesomeIcon icon={faSignOutAlt} size={20} color={color} />;
  };

  render() {
    const {navigation} = this.props;

    return (
      <>
        <AppHeader navigation={navigation} />
        {this.renderContent(this)}
      </>
    );
  }
}
