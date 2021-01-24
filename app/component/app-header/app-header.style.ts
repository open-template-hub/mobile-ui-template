import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appHeaderContainer: {
    backgroundColor: '#FAFAFA',
    width: '100%',
    height: 50,
    padding: 16,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
  },
  leftMenuButton: {
    position: 'absolute',
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
  },
  appNameText: {
    color: '#616161',
    fontSize: 16,
    marginLeft: 38,
    marginTop: -12,
    fontFamily: 'NotoSansJP-Bold',
  },
  leftLogo: {
    height: 26,
    width: 26,
    position: 'absolute',
    marginTop: 13,
    marginLeft: 16,
  },
});
