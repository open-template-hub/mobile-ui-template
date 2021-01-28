import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {styles} from './custom-input.style';

/**
 * @description holds custom input component
 */

export interface Props {
  validation: any;
  placeholder: string;
  isSecure: boolean | undefined;
  isEmail: boolean | undefined;
  editable: boolean;
  value: string | undefined;
  icon: IconProp;
  onChangeText(text: string): any;
}

/**
 * Custom Input Component
 */
export default class CustomInput extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      validation,
      placeholder,
      isSecure,
      isEmail,
      value,
      icon,
      editable,
      onChangeText,
    } = this.props;
    return (
      <View
        style={
          validation != null && !validation
            ? styles.inputErrorContainer
            : styles.inputContainer
        }>
        <FontAwesomeIcon
          icon={icon}
          size={16}
          color="#616161"
          style={styles.inputIcon}
        />
        {value ? <Text style={styles.placeholder}>{placeholder}</Text> : null}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#616161"
          autoCapitalize="none"
          keyboardType={isEmail ? 'email-address' : 'default'}
          secureTextEntry={isSecure}
          style={[styles.textInput, value ? null : styles.marginedText]}
          value={value}
          editable={editable}
          onChangeText={(text) => onChangeText(text)}
        />
      </View>
    );
  }
}
