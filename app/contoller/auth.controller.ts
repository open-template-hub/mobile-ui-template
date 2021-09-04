import {Config} from '../config/app.config';
import {GoogleSignin} from 'react-native-google-signin';
import {SocialLoginType} from '../enum/social-login.enum';
import {SocialLoginArgs} from '../interface/social-login-args.interface';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {AuthArgs} from '../interface/auth-args.interface';
import axios from 'axios';
import {Auth} from '../interface/auth.interface';
import {Storage} from '../app.store';
import {Logger} from '../util/logger.util';
import {LogSeverity} from '../enum/log-severity.enum';
import {Platform} from 'react-native';
import appleAuth, {
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

export class AuthController {
  signIn = async (args: AuthArgs) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with args: ',
      args,
      callerInstance: this,
      callerMethod: 'signIn',
    });
    try {
      const response = axios.post<any>(
        Config.Api.url + Config.Api.Endpoint.signIn,
        JSON.stringify(args),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: Config.Api.timeout,
          timeoutErrorMessage: Config.Api.timeoutErrorMessage,
        },
      );
      const auth = (await response).data as Auth;
      if (auth && auth.accessToken && auth.refreshToken) {
        await Storage.setAuth(auth);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: e,
        callerInstance: this,
        callerMethod: 'signIn',
      });
      return false;
    }
  };

  signUp = async (args: AuthArgs) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with args: ',
      args,
      callerInstance: this,
      callerMethod: 'signUp',
    });
    try {
      const response = axios.post<any>(
        Config.Api.url + Config.Api.Endpoint.signUp,
        JSON.stringify(args),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: Config.Api.timeout,
          timeoutErrorMessage: Config.Api.timeoutErrorMessage,
        },
      );

      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Auth Response: ',
        args: response,
        callerInstance: this,
        callerMethod: 'signUp',
      });

      const auth = (await response).data;

      if (auth && auth.email && auth.verificationToken) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: e,
        callerInstance: this,
        callerMethod: 'signUp',
      });
      return false;
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.signOut();
      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Google Sign Out Completed.',
        callerInstance: this,
        callerMethod: 'signOut',
      });
    } catch (e) {}

    try {
      LoginManager.logOut();
      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Facebook Sign Out Completed.',
        callerInstance: this,
        callerMethod: 'signOut',
      });
    } catch (e) {}

    await Storage.cleanAuth();
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Auth Clean Completed.',
      callerInstance: this,
      callerMethod: 'signOut',
    });

    await Storage.cleanPurchase();
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Purchase Clean Completed.',
      callerInstance: this,
      callerMethod: 'signOut',
    });
  };

  googleLogin = async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch (e) {}

      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (hasPlayServices) {
        return await this.googleIfHasPlayServices();
      } else {
        return false;
      }
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: e,
        callerInstance: this,
        callerMethod: 'googleLogin',
      });
      return false;
    }
  };

  googleIfHasPlayServices = async () => {
    const user = await GoogleSignin.signIn();

    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Result: ',
      callerInstance: this,
      args: user,
      callerMethod: 'googleLogin',
    });

    if (user) {
      const tokens = await GoogleSignin.getTokens();
      if (tokens && tokens.accessToken) {
        const args = {
          accessToken: tokens.accessToken,
          tokenType: 'bearer',
          key: SocialLoginType.GOOGLE,
        } as SocialLoginArgs;

        Logger.log({
          severity: LogSeverity.INFO,
          message: 'Access Token: ',
          callerInstance: this,
          args: tokens.accessToken,
          callerMethod: 'googleLogin',
        });

        const response = await this.socialLogin(args);

        const auth = response.data as Auth;
        if (auth && auth.accessToken && auth.refreshToken) {
          await Storage.setAuth(auth);
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };

  appleLogin = async () => {
    // performs login request
    if (Platform.OS === 'ios') {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      // const credentialState = await appleAuth.getCredentialStateForUser(
      //   appleAuthRequestResponse.user,
      // );

      // use credentialState response to ensure the user is authenticated
      // if (credentialState === appleAuth.State.AUTHORIZED) {
      if (
        appleAuthRequestResponse &&
        appleAuthRequestResponse.identityToken != undefined
      ) {
        return this.appleLoginInternal(appleAuthRequestResponse.identityToken);
      }
      // }
    } else {
      appleAuthAndroid.configure({
        // The Service ID you registered with Apple
        clientId: Config.Provider.Apple.Login.clientId,

        // Return URL added to your Apple dev console. We intercept this redirect, but it must still match
        // the URL you provided to Apple. It can be an empty route on your backend as it's never called.
        redirectUri: Config.Provider.Apple.Login.redirectUri,

        // The type of response requested - code, id_token, or both.
        responseType: appleAuthAndroid.ResponseType.ALL,

        // The amount of user information requested from Apple.
        scope: appleAuthAndroid.Scope.ALL,

        // Random nonce value that will be SHA256 hashed before sending to Apple.
        nonce: Config.Provider.Apple.Login.rawNonce,

        // Unique state value used to prevent CSRF attacks. A UUID will be generated if nothing is provided.
        state: Config.Provider.Apple.Login.state,
      });

      // Open the browser window for user sign in
      const response = await appleAuthAndroid.signIn();

      if (response && response.id_token != undefined && response.code) {
        return this.appleLoginInternal(response.id_token);
      }
    }

    return false;
  };

  appleLoginInternal = async (idToken: string) => {
    const args = {
      accessToken: idToken,
      tokenType: 'jwt',
      key: SocialLoginType.APPLE,
    } as SocialLoginArgs;

    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Access Token: ',
      callerInstance: this,
      args: idToken,
      callerMethod: 'appleLogin',
    });

    const res = await this.socialLogin(args);

    const auth = res.data as Auth;
    if (auth && auth.accessToken && auth.refreshToken) {
      await Storage.setAuth(auth);
      return true;
    } else {
      return false;
    }
  };

  facebookLogin = async () => {
    try {
      try {
        LoginManager.logOut();
      } catch (e) {}

      const login = await LoginManager.logInWithPermissions([
        'email',
        'public_profile',
      ]);

      Logger.log({
        severity: LogSeverity.INFO,
        message: 'Result: ',
        callerInstance: this,
        args: login,
        callerMethod: 'facebookLogin',
      });

      if (login.isCancelled) {
        Logger.log({
          severity: LogSeverity.MINOR,
          message: 'Login cancelled.',
          callerInstance: this,
          callerMethod: 'facebookLogin',
        });
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          const accessToken = data.accessToken.toString();
          const args = {
            accessToken: accessToken,
            tokenType: 'bearer',
            key: SocialLoginType.FACEBOOK,
          } as SocialLoginArgs;

          Logger.log({
            severity: LogSeverity.MINOR,
            message: 'Access Token: ',
            args: accessToken,
            callerInstance: this,
            callerMethod: 'facebookLogin',
          });

          const response = await this.socialLogin(args);

          const auth = response.data as Auth;

          if (auth && auth.accessToken && auth.refreshToken) {
            await Storage.setAuth(auth);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } catch (e) {
      Logger.log({
        severity: LogSeverity.MAJOR,
        message: 'Error: ',
        args: e,
        callerInstance: this,
        callerMethod: 'facebookLogin',
      });
      return false;
    }
    return false;
  };

  socialLogin = (args: SocialLoginArgs) => {
    return axios.post<any>(
      Config.Api.url + Config.Api.Endpoint.socialLogin,
      JSON.stringify(args),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: Config.Api.timeout,
        timeoutErrorMessage: Config.Api.timeoutErrorMessage,
      },
    );
  };

  getToken = async (args: Auth) => {
    const res = axios.post<any>(
      Config.Api.url + Config.Api.Endpoint.token,
      JSON.stringify({token: args.refreshToken}),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: Config.Api.timeout,
        timeoutErrorMessage: Config.Api.timeoutErrorMessage,
      },
    );

    var response = await res;

    if (response && response.status === 200 && response.data) {
      await Storage.setAuth(response.data);
      return true;
    } else {
      return false;
    }
  };
}
