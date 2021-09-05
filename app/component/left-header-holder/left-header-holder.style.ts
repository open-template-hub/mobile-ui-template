import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  leftHeader: {
    backgroundColor: Theme.Color.defaultButtonColor,
    height: 300,
    width: '100%',
    top: 0,
    borderBottomEndRadius: 225,
    borderTopLeftRadius: 325,
    position: 'absolute',
    opacity: 0.1,
    zIndex: 0,
  },
});
