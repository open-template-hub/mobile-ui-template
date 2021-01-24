import I18n from './../../i18n/i18n';
import React from 'react';
import {KeyboardAvoidingView, BackHandler, Text, View} from 'react-native';
import {Storage} from '../../app.store';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './sign-in.style';
import {Theme} from '../../constant/theme.constant';
import {Images} from '../../constant/images.constant';
import BrandHeader from './../../component/brand-header/brand-header.component';
import SocialLogin from './../../component/social-login/social-login.component';
import SignIn from './../../component/sign-in/sign-in.component';
import {Screens} from '../../constant/screens.constant';
import Loading from '../../component/loading/loading.component';
import {AnalyticsUtil} from '../../util/analytics.util';

interface Props {
  navigation: any;
}

interface State {
  loading: boolean;
}

export default class SignInScreen extends React.Component<Props, State> {
  private _focusListener: any;
  private _mounted: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount = () => {
    this._mounted = true;

    AnalyticsUtil.log(Screens.SignIn);

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
      let auth = await Storage.getAuth();
      console.log(auth);
      if (auth && auth.accessToken) {
        const {navigation} = this.props;
        navigation.navigate(Screens.Dashboard);
      }
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    } catch (e) {
      console.log('> SignIn:: Error occurred: ', e);
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
        <View style={{marginTop: Theme.Size.base * 4}}>
          <KeyboardAvoidingView behavior="padding" enabled>
            <BrandHeader />
            <SocialLogin navigation={navigation} main={this}></SocialLogin>

            <View style={styles.orBeClassical}>
              <Text style={styles.orBeClassicalLabel}>
                {I18n.t('orBeClassical')}
              </Text>
            </View>

            <View>{loading ? <Loading /> : null}</View>

            <SignIn navigation={navigation} main={this}></SignIn>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    );
  }
}
