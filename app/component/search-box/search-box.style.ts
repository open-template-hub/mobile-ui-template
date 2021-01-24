import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  inputContainer: {
    color: '#616161',
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    height: 50,
    backgroundColor: Theme.Color.white,
    borderWidth: 0.3,
    borderRadius: 8,
    borderColor: '#212121',
  },
  textInput: {
    fontSize: 14,
    marginTop: -34,
    marginLeft: 34,
    color: '#616161',
  },
  inputIcon: {
    marginTop: 8,
    marginLeft: 12,
    color: '#616161',
  },
});
