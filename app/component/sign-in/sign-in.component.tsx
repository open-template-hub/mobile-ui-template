import React from 'react';
import {Alert, ToastAndroid, View} from 'react-native';
import {faEnvelope} from '@fortawesome/free-regular-svg-icons';
import {faLock} from '@fortawesome/free-solid-svg-icons';
import {AuthController} from '../../contoller/auth.controller';
import {AuthArgs} from '../../interface/auth-args.interface';
import {Validation} from '../../util/validation.util';
import {styles} from './sign-in.style';
import Localization from '../../localization/i18n/Localization';
import CustomInput from '../custom-input/custom-input.component';
import CustomButton from '../custom-button/custom-button.component';
import LabelButton from '../label-button/label-button.component';
import {Screens} from '../../constant/screens.constant';

interface Props {
  navigation: any;
  main: any;
}

interface State {
  email: string;
  password: string;
  valid: any;
}

export default class SignIn extends React.Component<Props, State> {
  private _focusListener: any;
  private _mounted: boolean = false;
  private _authController: AuthController;
  private _validator: Validation;

  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      valid: {
        email: true,
        password: true,
      },
    };
    this._authController = new AuthController();
    this._validator = new Validation();
  }

  componentDidMount = () => {
    this._mounted = true;

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
    if (!this._mounted) return;

    this.setState({
      email: '',
      password: '',
      valid: {
        email: true,
        password: true,
      },
    });
  };

  signIn = async () => {
    const {main} = this.props;

    try {
      main.setState({loading: true});
      const {email, password} = this.state;
      let args = {
        email: email,
        password: password,
      } as AuthArgs;

      let validationResult = this._validator.validateLoginArgs(args);
      let valid = {
        email: validationResult.isEmailValid,
        password: validationResult.isPasswordValid,
      };
      this.setState({valid: valid});
      if (validationResult.isEmailValid && validationResult.isPasswordValid) {
        const {navigation} = this.props;
        const success = await this._authController.signIn(args);
        if (success) {
          navigation.navigate(Screens.Dashboard);
        } else {
          Alert.alert(Localization.t('credentialsNotRetained'));
        }
      } else {
        ToastAndroid.showWithGravity(
          Localization.t('credentialsNotValid'),
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      }
    } catch (e: any) {
      Alert.alert(Localization.t('signInErrorLabel'), e.message);
    } finally {
      main.setState({loading: false});
    }
  };

  render() {
    const onClickLogin = async () => {
      await this.signIn();
    };

    const {navigation, main} = this.props;
    const {email, password, valid} = this.state;
    const {loading} = main.state;

    return (
      <View style={styles.loginContainer}>
        <View>
          <CustomInput
            placeholder={Localization.t('email')}
            validation={valid.email}
            value={email}
            isEmail={true}
            onChangeText={(text: string) => this.setState({email: text})}
            icon={faEnvelope}
            isSecure={false}
            editable={!loading}
          />

          <CustomInput
            placeholder={Localization.t('password')}
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
            onPress={() => onClickLogin()}
            disabled={loading}
            title={Localization.t('signIn')}
          />

          <LabelButton
            disabled={loading}
            onPress={() => navigation.navigate(Screens.SignUp)}
            title={Localization.t('goToSignUp')}
          />
        </View>
      </View>
    );
  }
}
