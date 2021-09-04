import React from 'react';
import {Alert, View} from 'react-native';
import Localization from '../../localization/i18n/i18n.localization';
import {AuthController} from '../../contoller/auth.controller';
import SocialLoginButton from './../social-login-button/social-login-button.component';
import {SocialLoginType} from './../../enum/social-login.enum';
import {styles} from './social-login.style';
import {Screens} from './../../constant/screens.constant';

interface Props {
  navigation: any;
  main: any;
}

export default class SocialLogin extends React.Component<Props> {
  private _authController: AuthController;

  constructor(props: Props) {
    super(props);
    this._authController = new AuthController();
  }

  facebookLogin = async () => {
    const {main} = this.props;
    try {
      main.setState({loading: true});
      const {navigation} = this.props;
      const success = await this._authController.facebookLogin();
      if (success) {
        navigation.navigate(Screens.Dashboard);
      } else {
        Alert.alert(Localization.t('credentialsNotRetained'));
      }
    } catch (e) {
      Alert.alert(Localization.t('facebookLoginErrorLabel'));
    } finally {
      main.setState({loading: false});
    }
  };

  googleLogin = async () => {
    const {main} = this.props;
    try {
      main.setState({loading: true});
      const {navigation} = this.props;
      const success = await this._authController.googleLogin();
      if (success) {
        navigation.navigate(Screens.Dashboard);
      } else {
        Alert.alert(Localization.t('credentialsNotRetained'));
      }
    } catch (e) {
      Alert.alert(Localization.t('googleLoginErrorLabel') + e);
    } finally {
      main.setState({loading: false});
    }
  };

  render() {
    const onClickFacebookLogin = async () => {
      await this.facebookLogin();
    };

    const onClickGoogleLogin = async () => {
      await this.googleLogin();
    };

    const {main} = this.props;
    const {loading} = main.state;

    return (
      <View style={styles.socialLoginContainer}>
        <View style={styles.button1}>
          <SocialLoginButton
            onPress={async () => await onClickFacebookLogin()}
            type={SocialLoginType.FACEBOOK}
            disabled={loading}
          />
        </View>
        <View style={styles.button2}>
          <SocialLoginButton
            onPress={async () => await onClickGoogleLogin()}
            type={SocialLoginType.GOOGLE}
            disabled={loading}
          />
        </View>
      </View>
    );
  }
}
