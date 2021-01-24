import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  container: {
    color: '#212121',
    backgroundColor: Theme.Color.white,
    width: '100%',
    height: 180,
    marginTop: 25,
    alignItems: 'center',
    alignContent: 'center',
    padding: 10,
    borderWidth: 0.3,
    borderColor: '#212121',
    borderRadius: 8,
  },
  title: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '700',
  },
  price: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  purchaseButton: {
    bottom: 15,
    position: 'absolute',
    width: 120,
  },
});
