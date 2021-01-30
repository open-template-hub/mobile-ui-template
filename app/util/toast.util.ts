import Toast from 'react-native-simple-toast';

export class ToastUtil {
  public static show = (message: string) => {
    Toast.showWithGravity(message, Toast.LONG, Toast.BOTTOM);
  };
}
