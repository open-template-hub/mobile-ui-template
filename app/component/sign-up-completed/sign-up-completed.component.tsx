import React from 'react';
import {Text, View} from 'react-native';
import LabelButton from '../label-button/label-button.component';
import {styles} from './sign-up-completed.style';
import Localization from '../../localization/i18n/Localization';
import {Screens} from '../../constant/screens.constant';

interface Props {
  navigation: any;
}

export default class SignUpCompleted extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {navigation} = this.props;
    return (
      <>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            {Localization.t('signUpCompleted')}
          </Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <LabelButton
            disabled={false}
            onPress={() => navigation.navigate(Screens.SignIn)}
            title={Localization.t('goToSignIn')}
          />
        </View>
      </>
    );
  }
}
