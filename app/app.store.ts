import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import {Images} from './constant/images.constant';
import {Auth} from './interface/auth.interface';
import RNIap from 'react-native-iap';
import {Config} from './config/app.config';

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

  public static getFirebaseAppDefault = () => {
    var firebaseApp;

    try {
      firebaseApp = firebase.app();
    } catch (e) {
      firebaseApp = firebase.initializeApp(Config.Provider.Google.Firebase);
    }

    if (!firebaseApp) {
      firebaseApp = firebase.initializeApp(Config.Provider.Google.Firebase);
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

  public static getPurchase = async () => {
    return await AsyncStorage.getItem(Storage.PURCHASETOKENKEY);
  };

  public static isPremium = async () => {
    try {
      console.log('> Storage.isPremium:: Getting purchases');
      const purchases = await RNIap.getAvailablePurchases();
      console.log('> Storage.isPremium:: purchases: ', purchases);
      if (purchases && purchases.length > 0) {
        for (var i = 0; i < purchases.length; i++) {
          var p = purchases[i];
          if (p.purchaseToken) {
            console.log('Purchase: ', p);
            Storage.setPurchase(p.purchaseToken);
            break;
          }
        }
      } else {
        console.log('> Storage.isPremium:: Purchases are empty');
        Storage.setPurchase('');
      }
      const purchase = await Storage.getPurchase();
      return purchase ? true : false;
    } catch (e) {
      console.log('> Storage.isPremium:: Unexped error occurred: ', e);
      return false;
    }
  };

  public static setPurchase = async (purchaseToken: string) => {
    try {
      await AsyncStorage.setItem(Storage.PURCHASETOKENKEY, purchaseToken);
      console.log('purchase set: ', purchaseToken);
    } catch (error) {
      console.log('error on async storage (purchase): ', error);
    }
  };

  public static setAuth = async (auth: Auth) => {
    console.log('auth set', auth);
    if (auth) {
      try {
        await AsyncStorage.setItem(Storage.ACCESSTOKENKEY, auth.accessToken);
        await AsyncStorage.setItem(Storage.REFRESHTOKENKEY, auth.refreshToken);
      } catch (error) {
        console.log('error on async storage (auth): ', error);
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
