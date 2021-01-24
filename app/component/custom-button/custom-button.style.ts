import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  buttonContainer: {
    width: '90%',
    backgroundColor: Theme.Color.defaultButtonColor,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    alignSelf: 'center',
  },
  buttonTitle: {
    color: '#EEEEEE',
    fontWeight: '700',
    fontSize: 14,
  },
});
