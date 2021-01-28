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
      const response = await axios.post<any>(
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
      const auth = response.data as Auth;
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
      const response = await axios.post<any>(
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

      const auth = response.data;

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
    return false;
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

  socialLogin = async (args: SocialLoginArgs) => {
    return await axios.post<any>(
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
    const res = await axios.post<any>(
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

    if (res && res.status === 200 && res.data) {
      await Storage.setAuth(res.data);
      return true;
    } else {
      return false;
    }
  };
}
