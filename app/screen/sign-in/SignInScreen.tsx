import Localization from '../../localization/i18n/Localization';
import React from 'react';
import {KeyboardAvoidingView, BackHandler, Text, View} from 'react-native';
import {Storage} from '../../app.store';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './sign-in.style';
import {Theme} from '../../constant/theme.constant';
import SocialLogin from '../../component/social-login/social-login.component';
import SignIn from '../../component/sign-in/sign-in.component';
import {Screens} from '../../constant/screens.constant';
import Loading from '../../component/loading/loading.component';
import {AuthController} from '../../contoller/auth.controller';
import {Logger} from '../../util/logger.util';
import {LogSeverity} from '../../enum/log-severity.enum';
import LeftHeaderHolder from '../../component/left-header-holder/left-header-holder.component';
import RightBottomHolder from '../../component/right-bottom-holder/right-bottom-holder.component';

interface Props {
  navigation: any;
}

interface State {
  loading: boolean;
}

export default class SignInScreen extends React.Component<Props, State> {
  private _focusListener: any;
  private _mounted: boolean = false;
  private _authController: AuthController;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
    this._authController = new AuthController();
  }

  componentDidMount = () => {
    this._mounted = true;

    this._focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        await this.load();
      },
    );
  };

  componentWillUnmount = () => {
    // Remove the event listener
    try {
      this._focusListener.remove();
    } catch (e) {}
  };

  load = async () => {
    if (!this._mounted) return;

    try {
      this.setState({loading: true});
      let auth = await Storage.getAuth();
      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Auth token taken from storage: ',
        args: auth,
        callerInstance: this,
        callerMethod: 'load',
      });
      if (auth && auth.accessToken) {
        const success = await this._authController.getToken(auth);
        if (success) {
          const {navigation} = this.props;
          navigation.navigate(Screens.Dashboard);
        }
      }
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error occurred: ',
        args: e,
        callerInstance: this,
        callerMethod: 'load',
      });
    } finally {
      this.setState({loading: false});
    }
  };

  handleBackButton() {
    return true;
  }

  render() {
    const {navigation} = this.props;
    const {loading} = this.state;

    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 0.25, y: 1.1}}
        locations={[0.2, 1]}
        colors={[Theme.Color.signBack1, Theme.Color.signBack2]}
        style={[{flex: 1, paddingTop: Theme.Size.base * 4}]}>
        <LeftHeaderHolder />
        <View style={{marginTop: Theme.Size.base * 4}}>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.mainContainer}>
              <SocialLogin navigation={navigation} main={this}></SocialLogin>

              <View style={styles.orBeClassical}>
                <Text style={styles.orBeClassicalLabel}>
                  {Localization.t('orBeClassical')}
                </Text>
              </View>

              <View>{loading ? <Loading /> : null}</View>

              <SignIn navigation={navigation} main={this}></SignIn>
            </View>
          </KeyboardAvoidingView>
        </View>
        <RightBottomHolder />
      </LinearGradient>
    );
  }
}
