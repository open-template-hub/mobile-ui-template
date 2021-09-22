/**
 * @description holds configuration constants
 */

export const Config = {
  Api: {
    url: 'https://oth-server-orchestra-dev.herokuapp.com',
    Endpoint: {
      socialLoginUrl: '/social/login-url',
      socialLogin: '/social/login-with-access-token',
      signUp: '/auth/signup',
      signIn: '/auth/login',
      me: '/user/me',
      product: '/product/all',
      subscription: '/payment/subscription',
      token: '/auth/token',
      profileImageUpload: '/file/me',
      profileImageDownload: '/file/public',
    },
    timeout: 3000,
    timeoutErrorMessage: 'Request timed out',
    fileServiceProvicerKey: 'S3',
  },
  Provider: {
    Apple: {
      InApp: {
        products: ['item1', 'item2'],
      },
      Login: {
        rawNonce: '',
        state: '',
        clientId: '',
        redirectUri: '',
      },
    },
    Google: {
      Login: {
        clientId:
          '497051226013-adaka6m50h19b72m27qto9gukip07316.apps.googleusercontent.com',
        iosClientId:
          '566166882133-jgp1rip0j4gna426be58vdsi9p8eqqr9.apps.googleusercontent.com',
      },
      InApp: {
        subscriptionPaymentKey: 'GOOGLE_INAPP_SUBSCRIPTION',
        products: ['item1', 'item2'],
      },

      Admob: {
        bannerId: 'ca-app-pub-3940256099942544/6300978111',
      },
      Firebase: {
        AppName: 'momento-auth',
        Android: {
          apiKey: 'AIzaSyCmONeFs1rK5ZxTeqna-iwTob6st1aegys',
          authDomain: 'momento-auth.firebaseapp.com',
          databaseURL: 'https://momento-auth.firebaseio.com',
          projectId: 'momento-auth',
          storageBucket: 'momento-auth.appspot.com',
          messagingSenderId: '566166882133',
          appId: '1:566166882133:android:da51b2baa0b1400db791dc',
        },
        Ios: {
          apiKey: 'AIzaSyA81lrwsEa-iuKZydX0SQ1am03Yf-EnYuw',
          authDomain: 'momento-auth.firebaseapp.com',
          databaseURL: 'https://momento-auth.firebaseio.com',
          projectId: 'momento-auth',
          storageBucket: 'momento-auth.appspot.com',
          messagingSenderId: '566166882133',
          appId: '1:566166882133:ios:248394cce5304759b791dc',
        },
      },
    },
    Facebook: {
      Login: {
        clientId: '415918476419712',
      },
    },
  },
};
