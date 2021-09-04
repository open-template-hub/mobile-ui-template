import React from 'react';
import DashboardScreen from './screen/dashboard/dashboard.screen';
import OnboardingScreen from './screen/onboarding/onboarding.screen';
import {createStackNavigator} from '@react-navigation/stack';
import {Screens} from './constant/screens.constant';
import SignInScreen from './screen/sign-in/sign-in.screen';
import SignUpScreen from './screen/sign-up/sign-up.screen';

export default class AppScreen extends React.Component {
  private _Stack: any;

  constructor(props: any) {
    super(props);
    this._Stack = createStackNavigator();
  }

  render() {
    return (
      <this._Stack.Navigator>
        <this._Stack.Screen
          name={Screens.Onboarding}
          component={OnboardingScreen}
          options={{headerShown: false}}
        />
        <this._Stack.Screen
          name={Screens.SignIn}
          component={SignInScreen}
          options={{headerShown: false}}
        />
        <this._Stack.Screen
          name={Screens.SignUp}
          component={SignUpScreen}
          options={{headerShown: false}}
        />
        <this._Stack.Screen
          name={Screens.Dashboard}
          component={DashboardScreen}
          options={{headerShown: false}}
        />
      </this._Stack.Navigator>
    );
  }
}
