import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React from 'react';
import {View, TextInput} from 'react-native';
import {styles} from './search-box.style';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

/**
 * @description holds custom input component
 */

export interface Props {
  placeholder: string;
  value: string | undefined;
  onChangeText(text: string): any;
}

/**
 * Custom Input Component
 */
export default class SearchBox extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {placeholder, value, onChangeText} = this.props;
    return (
      <View style={styles.inputContainer}>
        <FontAwesomeIcon
          icon={faSearch}
          size={18}
          color="#616161"
          style={styles.inputIcon}
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#616161"
          autoCapitalize="none"
          style={styles.textInput}
          value={value}
          onChangeText={(text) => onChangeText(text)}
        />
      </View>
    );
  }
}
