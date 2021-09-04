import React from 'react';
import {View, Image, ActivityIndicator, Platform} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {Storage} from '../../app.store';
import {Config} from '../../config/app.config';
import {Images} from '../../constant/images.constant';
import {Screens} from '../../constant/screens.constant';
import {styles} from './onboarding.style';

interface Props {
  navigation: any;
}

export default class OnboardingScreen extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  componentDidMount = async () => {
    const {navigation} = this.props;

    await Storage.initializeStorage();
    await Storage.getFirebaseAppDefault();

    if (Platform.OS === 'ios') {
      await GoogleSignin.configure({
        scopes: ['openid', 'profile', 'email'],
        webClientId: Config.Provider.Google.Login.clientId,
        iosClientId: Config.Provider.Google.Login.iosClientId,
      });
    } else {
      GoogleSignin.configure({
        scopes: ['openid', 'profile', 'email'],
        webClientId: Config.Provider.Google.Login.clientId,
      });
    }

    navigation.navigate(Screens.SignIn);
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.Splash} style={styles.splash} />
        <ActivityIndicator
          size="large"
          color="#b71c1c"
          style={styles.activity}
        />
      </View>
    );
  }
}
