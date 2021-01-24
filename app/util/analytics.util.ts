import analytics from '@react-native-firebase/analytics';

export class AnalyticsUtil {
  public static log = async (
    eventName: string,
    params?:
      | {
          [key: string]: any;
        }
      | undefined,
  ) => {
    try {
      await analytics().logEvent(eventName, params);
    } catch (e) {
      console.log('> ' + eventName + ':: Error on logging analytics: ', e);
    }
  };

  public static logAppOpen = async () => {
    try {
      await analytics().logAppOpen();
    } catch (e) {
      console.log('> logAppOpen:: Error on logging analytics: ', e);
    }
  };
}
