import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  inputContainer: {
    color: '#212121',
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    borderTopLeftRadius: 25,
    borderBottomEndRadius: 25,
    marginTop: 20,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  inputErrorContainer: {
    color: '#212121',
    borderWidth: 0.5,
    borderColor: Theme.Color.errorBackgroundColor,
    borderTopLeftRadius: 25,
    borderBottomEndRadius: 25,
    marginTop: 20,
    width: '90%',
    height: 45,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  textInput: {
    fontSize: 13,
    marginLeft: 48,
    marginTop: -11,
    color: '#616161',
  },
  marginedText: {
    marginTop: -32,
  },
  inputIcon: {
    marginTop: 22,
    marginLeft: 26,
    color: '#616161',
  },
  placeholder: {
    marginTop: -34,
    marginLeft: 26,
    fontSize: 10,
    color: Theme.Color.defaultButtonColor,
    fontWeight: '700',
  },
});
