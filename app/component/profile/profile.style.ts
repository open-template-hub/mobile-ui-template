import {StyleSheet} from 'react-native';
import {Theme} from '../../constant/theme.constant';

export const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: Theme.Color.defaultPageBackground,
  },
  textContainer: {
    width: '100%',
    alignContent: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  username: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: Theme.Color.defaultButtonColor,
  },
  inputs: {
    marginTop: 25,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderColor: '#212121',
    borderWidth: 0.1,
    borderRadius: 75,
  },
  emptyProfileImage: {
    width: 120,
    height: 120,
    borderColor: '#212121',
    backgroundColor: '#E0E0E0',
    borderWidth: 0.1,
    borderRadius: 75,
    alignContent: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  actions: {
    marginTop: 30,
  },
});
