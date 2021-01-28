/**
 * @description holds configuration constants
 */

export const Config = {
  Api: {
    url: 'https://oth-orchestration.herokuapp.com',
    Endpoint: {
      socialLoginUrl: '/social/login-url',
      socialLogin: '/social/login-with-access-token',
      signUp: '/auth/signup',
      signIn: '/auth/login',
      me: '/user/me',
      subscription: '/payment/subscription',
      token: '/auth/token'
    },
    timeout: 3000,
    timeoutErrorMessage: 'Request timed out',
  },
  Provider: {
    Google: {
      Login: {
        clientId:
          '497051226013-adaka6m50h19b72m27qto9gukip07316.apps.googleusercontent.com',
      },
      InApp: {
        subscriptionPaymentKey: 'GOOGLE_INAPP_SUBSCRIPTION',
        products: ['item1', 'item2'],
      },
      Admob: {
        bannerId: 'ca-app-pub-3175253098800565/3119626356',
      },
      Firebase: {
        apiKey:
          'AAAAc7qPz50:APA91bHGi4y4DSrKX2f_gxRfqAGSQUncPsTPlPVh5f6PGKAsWf1-ZGMCx9x_qcDFS5xX8Mo6Io4rxeXacmOhGMwhdFI4y9jTUgYBajpbjjqdHtQssgmro89Fbk-0Q-9U1J-XtC5XRy2c',
        authDomain: 'oth-auth-server.firebaseapp.com',
        databaseURL: 'https://oth-auth-server.firebaseio.com',
        projectId: 'oth-auth-server',
        storageBucket: 'oth-auth-server.appspot.com',
        messagingSenderId: '497051226013',
        appId: 'oth-auth-server',
      },
    },
    Facebook: {
      Login: {
        clientId: '415918476419712',
      },
    },
  },
};
