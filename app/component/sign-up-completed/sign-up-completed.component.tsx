import React from 'react';
import {Text, View} from 'react-native';
import LabelButton from '../label-button/label-button.component';
import {styles} from './sign-up-completed.style';
import I18n from './../../i18n/i18n';
import {Screens} from '../../constant/screens.constant';

interface Props {
  navigation: any;
}

export default class SignUpCompleted extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const {navigation} = this.props;
    return (
      <>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{I18n.t('signUpCompleted')}</Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <LabelButton
            disabled={false}
            onPress={() => navigation.navigate(Screens.SignIn)}
            title={I18n.t('goToSignIn')}
          />
        </View>
      </>
    );
  }
}
