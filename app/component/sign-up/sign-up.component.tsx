import React from 'react';
import {Alert, ToastAndroid, View} from 'react-native';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {AuthController} from '../../contoller/auth.controller';
import {AuthArgs} from '../../interface/auth-args.interface';
import {Validation} from '../../util/validation.util';
import {styles} from './sign-up.style';
import I18n from './../../i18n/i18n';
import CustomInput from '../custom-input/custom-input.component';
import CustomButton from '../custom-button/custom-button.component';
import LabelButton from '../label-button/label-button.component';
import {Screens} from '../../constant/screens.constant';

interface Props {
  navigation: any;
  main: any;
  onSignUpCompleted(): any;
}

interface State {
  user: string;
  email: string;
  password: string;
  valid: any;
}

export default class SignUp extends React.Component<Props, State> {
  private _authController: AuthController;
  private _validator: Validation;
  private _focusListener: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      user: '',
      email: '',
      password: '',
      valid: {
        user: true,
        email: true,
        password: true,
      },
    };
    this._authController = new AuthController();
    this._validator = new Validation();
  }

  componentDidMount = () => {
    this._focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        await this.cleanup();
      },
    );
  };

  componentWillUnmount = () => {
    // Remove the event listener
    try {
      this._focusListener.remove();
    } catch (e) {}
  };

  cleanup = async () => {
    this.setState({
      user: '',
      email: '',
      password: '',
      valid: {
        user: true,
        email: true,
        password: true,
      },
    });
  };

  signUp = async () => {
    const {main, onSignUpCompleted} = this.props;
    try {
      main.setState({loading: true});
      const {user, email, password} = this.state;
      let args = {
        username: user,
        email: email,
        password: password,
      } as AuthArgs;
      let validationResult = this._validator.validateSignUpArgs(args);
      let valid = {
        user: validationResult.isUsernameValid,
        email: validationResult.isEmailValid,
        password: validationResult.isPasswordValid,
      };
      this.setState({valid: valid});
      if (
        validationResult.isEmailValid &&
        validationResult.isPasswordValid &&
        validationResult.isUsernameValid
      ) {
        const success = await this._authController.signUp(args);
        if (success) {
          onSignUpCompleted();
        } else {
          Alert.alert(I18n.t('signUpError'));
        }
      } else {
        ToastAndroid.showWithGravity(
          I18n.t('credentialsNotValid'),
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    } catch (e) {
      Alert.alert(I18n.t('signUpErrorLabel'), e.message);
    } finally {
      main.setState({loading: false});
    }
  };

  render() {
    const onClickSignUp = async () => {
      await this.signUp();
    };

    const {navigation, main} = this.props;
    const {user, email, password, valid} = this.state;
    const {loading} = main.state;
    return (
      <View style={styles.signUpContainer}>
        <View>
          <CustomInput
            placeholder={I18n.t('username')}
            validation={valid.username}
            value={user}
            isEmail={false}
            onChangeText={(text: string) => this.setState({user: text})}
            icon={faUser}
            isSecure={false}
            editable={!loading}
          />

          <CustomInput
            placeholder={I18n.t('email')}
            validation={valid.email}
            value={email}
            isEmail={true}
            onChangeText={(text: string) => this.setState({email: text})}
            icon={faEnvelope}
            isSecure={false}
            editable={!loading}
          />

          <CustomInput
            placeholder={I18n.t('password')}
            validation={valid.password}
            value={password}
            isEmail={false}
            onChangeText={(text: string) => this.setState({password: text})}
            icon={faLock}
            isSecure={true}
            editable={!loading}
          />
        </View>

        <View style={styles.actionButtonContainer}>
          <CustomButton
            onPress={async () => await onClickSignUp()}
            disabled={loading}
            title={I18n.t('signUp')}
          />

          <LabelButton
            disabled={loading}
            onPress={() => navigation.navigate(Screens.SignIn)}
            title={I18n.t('goToSignIn')}
          />
        </View>
      </View>
    );
  }
}
