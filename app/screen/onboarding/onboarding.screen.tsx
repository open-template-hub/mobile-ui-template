import React from 'react';
import {View, Image, ActivityIndicator} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {Storage} from '../../app.store';
import {AnalyticsUtil} from '../../util/analytics.util';
import {Config} from './../../config/app.config';
import {Images} from './../../constant/images.constant';
import {Screens} from './../../constant/screens.constant';
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
    Storage.getFirebaseAppDefault();
    AnalyticsUtil.logAppOpen();

    GoogleSignin.configure({
      scopes: ['openid', 'profile', 'email'],
      webClientId: Config.Provider.Google.Login.clientId,
    });

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
