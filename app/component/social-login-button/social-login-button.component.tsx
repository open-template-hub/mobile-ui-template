import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFacebookF, faGoogle} from '@fortawesome/free-brands-svg-icons';
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {styles} from './social-login-button.style';
import {SocialLoginType} from '../../enum/social-login.enum';

interface Props {
  onPress(): any;
  type: SocialLoginType;
  disabled: boolean;
}

export default class SocialLoginButton extends React.Component<Props> {
  private buttonSize: number = 24;

  constructor(props: any) {
    super(props);
  }

  render() {
    const {onPress, type, disabled} = this.props;

    var slType =
      type === SocialLoginType.FACEBOOK
        ? styles.facebook
        : type === SocialLoginType.GOOGLE
        ? styles.google
        : null;

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          onPress();
        }}>
        <View style={[styles.container, slType]}>
          {type === SocialLoginType.FACEBOOK ? (
            <FontAwesomeIcon
              icon={faFacebookF}
              size={this.buttonSize}
              color="#EEEEEE"
            />
          ) : type === SocialLoginType.GOOGLE ? (
            <FontAwesomeIcon
              icon={faGoogle}
              size={this.buttonSize}
              color="#EEEEEE"
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}
