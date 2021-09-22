import {StyleSheet} from 'react-native';
import { Theme } from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    top: '10%',
  },
  product: {
    width: '30%',
  },
  products: {
    flexDirection: 'row',
  },
  noInAppProductContainer: {
    minHeight: 500,
    width: '80%',
    flex: 1,
    justifyContent: 'flex-start',

  },
  noInAppProductText: {
    color: Theme.Color.errorTintColor,
    fontSize: 13,
    fontWeight: '700',
    alignSelf: 'center',
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center',
  }
});
