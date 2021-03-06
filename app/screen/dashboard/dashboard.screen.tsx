import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faSitemap,
  faIdBadge,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import {Theme} from '../../constant/theme.constant';
import Localization from '../../localization/i18n/i18n.localization';
import {AnalyticsUtil} from '../../util/analytics.util';
import {Screens} from '../../constant/screens.constant';
import ProductListScreen from '../product-list/product-list.screen';
import AppHeader from '../../component/app-header/app-header.component';
import ProfileScreen from '../profile/profile.screen';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SignOutScreen from '../sign-out/sign-out.screen';
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
    AnalyticsUtil.log(Screens.Dashboard);
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

  render() {
    const {navigation} = this.props;

    return (
      <>
        <AppHeader navigation={navigation} />
        {Theme.Menu.style === MenuStyle.Left ? (
          <this._Drawer.Navigator
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
            <this._Drawer.Screen
              name={Localization.t('profile')}
              component={ProfileScreen}
              options={{
                drawerIcon: ({color}: any) => (
                  <FontAwesomeIcon icon={faIdBadge} size={20} color={color} />
                ),
              }}
            />
            <this._Drawer.Screen
              name={Localization.t('products')}
              component={ProductListScreen}
              options={{
                drawerIcon: ({color}: any) => (
                  <FontAwesomeIcon icon={faSitemap} size={20} color={color} />
                ),
              }}
            />
            <this._Drawer.Screen
              name={Localization.t('signOut')}
              component={SignOutScreen}
              options={{
                drawerIcon: ({color}: any) => (
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    size={20}
                    color={color}
                  />
                ),
              }}
            />
          </this._Drawer.Navigator>
        ) : Theme.Menu.style === MenuStyle.Tab ? (
          <this._Tab.Navigator
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
            <this._Tab.Screen
              name={Localization.t('profile')}
              component={ProfileScreen}
              options={{
                tabBarLabel: Localization.t('profile'),
                tabBarIcon: ({color, size}: any) => (
                  <FontAwesomeIcon icon={faIdBadge} size={20} color={color} />
                ),
              }}
            />
            <this._Tab.Screen
              name={Localization.t('products')}
              component={ProductListScreen}
              options={{
                tabBarLabel: Localization.t('products'),
                tabBarIcon: ({color, size}: any) => (
                  <FontAwesomeIcon icon={faSitemap} size={20} color={color} />
                ),
              }}
            />
            <this._Tab.Screen
              name={Localization.t('signOut')}
              component={SignOutScreen}
              options={{
                tabBarLabel: Localization.t('signOut'),
                tabBarIcon: ({color, size}: any) => (
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    size={20}
                    color={color}
                  />
                ),
              }}
            />
          </this._Tab.Navigator>
        ) : null}
      </>
    );
  }
}
