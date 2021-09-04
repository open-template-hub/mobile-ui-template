import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {Theme} from '../../constant/theme.constant';
import {styles} from './custom-button-with-icon.style';

interface Props {
  onPress(): any;
  title?: string;
  disabled: boolean;
  color?: string;
  tintColor?: string;
  icon?: any;
  iconSize?: number;
}

export default class CustomButtonWithIcon extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const {
      onPress,
      title,
      disabled,
      color,
      tintColor,
      icon,
      iconSize,
    } = this.props;
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          onPress();
        }}>
        <View
          style={[
            styles.buttonContainer,
            color ? {backgroundColor: color} : null,
          ]}>
          {icon ? (
            <FontAwesomeIcon
              icon={icon}
              size={iconSize ? iconSize : 20}
              color={tintColor ? tintColor : Theme.Color.defaultButtonTintColor}
            />
          ) : null}
          {title ? (
            <Text
              style={[
                styles.buttonTitle,
                tintColor ? {color: tintColor} : null,
                icon ? {paddingLeft: 8} : null,
              ]}>
              {title}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}
