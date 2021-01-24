import {Config} from '../config/app.config';
import {GoogleSignin} from 'react-native-google-signin';
import {SocialLoginType} from '../enum/social-login.enum';
import {SocialLoginArgs} from '../interface/social-login-args.interface';
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {AuthArgs} from '../interface/auth-args.interface';
import axios from 'axios';
import {Auth} from '../interface/auth.interface';
import {Storage} from '../app.store';

export class AuthController {
  signIn = async (args: AuthArgs) => {
    try {
      const response = await axios.post<any>(
        Config.Api.url + Config.Api.Endpoint.signIn,
        JSON.stringify(args),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 5000,
          timeoutErrorMessage: 'Request timed out',
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
      console.log('AuthController signIn Error: ', e);
      return false;
    }
  };

  signUp = async (args: AuthArgs) => {
    try {
      const response = await axios.post<any>(
        Config.Api.url + Config.Api.Endpoint.signUp,
        JSON.stringify(args),
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          timeout: 5000,
          timeoutErrorMessage: 'Request timed out',
        },
      );

      console.log('Auth Response: ', response);

      const auth = response.data;

      if (auth && auth.email && auth.verificationToken) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('AuthController SignUp Error: ', e);
      return false;
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('signOut::Google Sign Out Completed');
    } catch (e) {}

    try {
      LoginManager.logOut();
      console.log('signOut::Facebook Sign Out Completed');
    } catch (e) {}

    await Storage.cleanAuth();
    console.log('signOut::Auth Clean Completed');

    await Storage.cleanPurchase();
    console.log('signOut::Purchase Clean Completed');
  };

  googleLogin = async () => {
    try {
      try {
        await GoogleSignin.signOut();
      } catch (e) {}

      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (hasPlayServices) {
        const user = await GoogleSignin.signIn();

        console.log('googleLogin::Result: ', user);

        if (user) {
          const tokens = await GoogleSignin.getTokens();
          if (tokens && tokens.accessToken) {
            const args = {
              accessToken: tokens.accessToken,
              tokenType: 'bearer',
              key: SocialLoginType.GOOGLE,
            } as SocialLoginArgs;
            console.log('googleLogin::Access Token: ', tokens.accessToken);
            const response = await this.socialLogin(args);
            // console.log('googleLogin:: response Data:', response);
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

      console.log(login);

      if (login.isCancelled) {
        console.log('Login cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          const accessToken = data.accessToken.toString();
          const args = {
            accessToken: accessToken,
            tokenType: 'bearer',
            key: SocialLoginType.FACEBOOK,
          } as SocialLoginArgs;
          console.log('facebookLogin::Access Token: ', accessToken);
          const response = await this.socialLogin(args);
          // console.log('facebookLogin:: response Data:', response);
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
      console.log('facebookLogin:: Unexpected error: ', e);
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
        timeout: 5000,
        timeoutErrorMessage: 'Request timed out',
      },
    );
  };
}
