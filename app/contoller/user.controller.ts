import {Config} from '../config/app.config';
import {Auth} from '../interface/auth.interface';
import axios from 'axios';

export class UserController {
  getMe = async (auth: Auth) => {
    console.log('getMe AccessToken: ', auth.accessToken);

    const bearer = 'Bearer ' + auth.accessToken;
    return await axios.get<any>(Config.Api.url + Config.Api.Endpoint.me, {
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 5000,
    });
  };
}
