import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  product: {
    backgroundColor: Theme.Color.white,
    borderWidth: 0.3,
    borderColor: '#212121',
    borderRadius: 8,
    minHeight: 115,
    padding: 10,
  },
  endContainer: {
    position: 'absolute',
    right: 5,
  },
  productId: {
    flexWrap: 'wrap',
    fontWeight: '700',
    color: Theme.Color.defaultButtonColor,
    fontSize: 14,
  },
  productTitle: {
    flexWrap: 'wrap',
    fontWeight: '700',
    color: '#212121',
    fontSize: 13,
    marginTop: 15,
  },
  productDescription: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
  },
  productDate: {
    fontWeight: '700',
    flexWrap: 'wrap',
    paddingTop: 3,
    fontSize: 13,
  },
  prediction: {
    marginTop: 10,
  },
  averageTitle: {
    fontWeight: '700',
    color: '#616161',
    fontSize: 13,
  },
  averageScore: {
    fontWeight: '700',
    color: '#BF360C',
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: Theme.Size.base / 2,
    marginTop: -26,
  },
  horizontalImage: {
    height: 32,
    width: 32,
  },
  horizontalImageEnd: {
    marginTop: -10,
  },
  fullImage: {
    height: 61.5,
    width: 32.5,
  },
});
