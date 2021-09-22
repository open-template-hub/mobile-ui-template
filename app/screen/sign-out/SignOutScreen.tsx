import React from 'react';
import {AuthController} from '../../contoller/auth.controller';
import {Screens} from '../../constant/screens.constant';
import {View} from 'react-native';

interface Props {
  navigation: any;
}

export default class SignOutScreen extends React.Component<Props> {
  private _authController: AuthController;
  constructor(props: Props) {
    super(props);
    this._authController = new AuthController();
  }

  componentDidMount = async () => {
    await this.signOut();
  };

  signOut = async () => {
    await this._authController.signOut();
    const {navigation} = this.props;
    navigation.navigate(Screens.SignIn);
  };

  render() {
    return <View></View>;
  }
}
