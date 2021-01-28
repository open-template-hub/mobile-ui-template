import {StyleSheet} from 'react-native';
import { Theme } from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  inputContainer: {
    color: '#212121',
    borderBottomWidth: 1,
    borderBottomColor: '#616161',
    borderRadius: 1,
    marginTop: 20,
    width: '90%',
    height: 35,
    alignSelf: 'center',
  },
  inputErrorContainer: {
    color: '#212121',
    borderBottomWidth: 1,
    borderBottomColor: '#b71c1c',
    borderRadius: 1,
    marginTop: 20,
    width: '90%',
    height: 35,
    alignSelf: 'center',
  },
  textInput: {
    fontSize: 13,
    marginLeft: 34,
    color: '#616161',
  },
  marginedText: {
    marginTop: -32
  },
  inputIcon: {
    marginTop: 8,
    marginLeft: 12,
    color: '#616161',
  },
  placeholder: {
    marginTop: -38,
    marginLeft: 12,
    fontSize: 10,
    color: Theme.Color.defaultButtonColor,
    fontWeight: '700',
  },
});
