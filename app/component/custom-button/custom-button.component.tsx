import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from './custom-button.style';

interface Props {
  onPress(): any;
  title: string;
  disabled: boolean;
}

export default class CustomButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {onPress, title, disabled} = this.props;
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          onPress();
        }}>
        <View style={[styles.buttonContainer]}>
          <Text style={styles.buttonTitle}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
