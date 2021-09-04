import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import {Images} from './constant/images.constant';
import {Auth} from './interface/auth.interface';
import * as RNIap from 'react-native-iap';
import {Config} from './config/app.config';
import {Logger} from './util/logger.util';
import {LogSeverity} from './enum/log-severity.enum';
import {Platform} from 'react-native';

export class Storage {
  public static ACCESSTOKENKEY = '@MOBILEUITEMPLATE:@ACCESSTOKEN';
  public static REFRESHTOKENKEY = '@MOBILEUITEMPLATE:@REFRESHTOKEN';
  public static PURCHASETOKENKEY = '@MOBILEUITEMPLATE:@PURCHASETOKEN';

  public static profile = {
    avatar: Images.Profile,
    name: 'Ghost',
    type: 'Seller',
    plan: 'Pro',
    rating: 4.8,
  };

  public static initializeStorage = async () => {
    await RNIap.initConnection();
  };

  public static getFirebaseAppDefault = async () => {
    const cfg = {
      name: Config.Provider.Google.Firebase.AppName,
    };
    var firebaseApp = null;
    if (Platform.OS === 'ios') {
      firebaseApp = await firebase.initializeApp(
        Config.Provider.Google.Firebase.Ios,
        cfg,
      );
      console.log('Initialized ios', firebaseApp);
    } else {
      try {
        firebaseApp = firebase.app();
      } catch (e) {}

      if (firebaseApp == null) {
        firebaseApp = await firebase.initializeApp(
          Config.Provider.Google.Firebase.Android,
          cfg,
        );
      }
    }

    return firebaseApp;
  };

  public static getAuth = async () => {
    const accessToken = await AsyncStorage.getItem(Storage.ACCESSTOKENKEY);
    const refreshToken = await AsyncStorage.getItem(Storage.REFRESHTOKENKEY);
    return {
      accessToken,
      refreshToken,
    } as Auth;
  };

  public static getPurchase = () => {
    return AsyncStorage.getItem(Storage.PURCHASETOKENKEY);
  };

  public static isPremium = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases && purchases.length > 0) {
        for (let p of purchases) {
          if (p.purchaseToken) {
            Logger.log({
              severity: LogSeverity.INFO,
              message: 'Purchase Found: ',
              args: p,
              callerInstanceName: 'Storage',
              callerMethod: 'isPremium',
            });
            Storage.setPurchase(p.purchaseToken);
            break;
          }
        }
      } else {
        Logger.log({
          severity: LogSeverity.INFO,
          message: 'Purchases are empty.',
          callerInstanceName: 'Storage',
          callerMethod: 'isPremium',
        });
        Storage.setPurchase('');
      }
      const purchase = await Storage.getPurchase();
      return purchase ? true : false;
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: e,
        callerInstanceName: 'Storage',
        callerMethod: 'isPremium',
      });
      return false;
    }
  };

  public static setPurchase = async (purchaseToken: string) => {
    try {
      await AsyncStorage.setItem(Storage.PURCHASETOKENKEY, purchaseToken);
      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Purchase Set: ',
        args: purchaseToken,
        callerInstanceName: 'Storage',
        callerMethod: 'setPurchase',
      });
    } catch (error) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: error,
        callerInstanceName: 'Storage',
        callerMethod: 'setPurchase',
      });
    }
  };

  public static setAuth = async (auth: Auth) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Auth Set: ',
      args: auth,
      callerInstanceName: 'Storage',
      callerMethod: 'setAuth',
    });
    if (auth) {
      try {
        await AsyncStorage.setItem(Storage.ACCESSTOKENKEY, auth.accessToken);
        await AsyncStorage.setItem(Storage.REFRESHTOKENKEY, auth.refreshToken);
      } catch (error) {
        Logger.log({
          severity: LogSeverity.MAJOR,
          message: 'Error: ',
          args: error,
          callerInstanceName: 'Storage',
          callerMethod: 'setAuth',
        });
      }
    }
  };

  public static cleanAuth = async () => {
    await AsyncStorage.removeItem(Storage.ACCESSTOKENKEY);
    await AsyncStorage.removeItem(Storage.REFRESHTOKENKEY);
  };

  public static cleanPurchase = async () => {
    await AsyncStorage.removeItem(Storage.PURCHASETOKENKEY);
  };
}
