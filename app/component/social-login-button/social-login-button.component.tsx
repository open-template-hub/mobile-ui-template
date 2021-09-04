import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faApple,
  faFacebookF,
  faGoogle,
} from '@fortawesome/free-brands-svg-icons';
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

  renderContent = (type: SocialLoginType) => {
    if (type === SocialLoginType.FACEBOOK) {
      return (
        <FontAwesomeIcon
          icon={faFacebookF}
          size={this.buttonSize}
          color="#EEEEEE"
        />
      );
    } else if (type === SocialLoginType.GOOGLE) {
      return (
        <FontAwesomeIcon
          icon={faGoogle}
          size={this.buttonSize}
          color="#EEEEEE"
        />
      );
    } else if (type === SocialLoginType.APPLE) {
      return (
        <FontAwesomeIcon
          icon={faApple}
          size={this.buttonSize}
          color="#EEEEEE"
        />
      );
    } else {
      return null;
    }
  };

  render() {
    const {onPress, type, disabled} = this.props;

    var slType = null;

    if (type === SocialLoginType.FACEBOOK) {
      slType = styles.facebook;
    } else if (type === SocialLoginType.GOOGLE) {
      slType = styles.google;
    } else if (type === SocialLoginType.APPLE) {
      slType = styles.apple;
    }

    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          onPress();
        }}>
        <View style={[styles.container, slType]}>
          {this.renderContent(type)}
        </View>
      </TouchableOpacity>
    );
  }
}
