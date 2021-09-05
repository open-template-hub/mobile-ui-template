import Localization from '../../localization/i18n/Localization';
import React from 'react';
import {KeyboardAvoidingView, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {styles} from './sign-up.style';
import {Theme} from '../../constant/theme.constant';
import SocialLogin from '../../component/social-login/social-login.component';
import SignUp from '../../component/sign-up/sign-up.component';
import Loading from '../../component/loading/loading.component';
import SignUpCompleted from '../../component/sign-up-completed/sign-up-completed.component';
import LeftHeaderHolder from '../../component/left-header-holder/left-header-holder.component';

interface Props {
  navigation: any;
}

interface State {
  loading: boolean;
  signUpCompleted: boolean;
}

export default class SignUpScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      signUpCompleted: false,
    };
  }

  onSignUpCompleted = () => {
    this.setState({signUpCompleted: true});
  };

  renderLoadingContent = (loading: boolean) => {
    return loading ? <Loading /> : null;
  };

  render() {
    const {navigation} = this.props;
    const {loading, signUpCompleted} = this.state;

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
              {signUpCompleted ? (
                <SignUpCompleted navigation={navigation} />
              ) : (
                <>
                  <SocialLogin
                    navigation={navigation}
                    main={this}></SocialLogin>

                  <View style={styles.orBeClassical}>
                    <Text style={styles.orBeClassicalLabel}>
                      {Localization.t('orBeClassical')}
                    </Text>
                  </View>

                  <View>{this.renderLoadingContent(loading)}</View>

                  <SignUp
                    navigation={navigation}
                    main={this}
                    onSignUpCompleted={this.onSignUpCompleted}></SignUp>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    );
  }
}
