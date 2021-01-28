import {Config} from '../config/app.config';
import {Auth} from '../interface/auth.interface';
import axios, {CancelToken} from 'axios';
import {Logger} from '../util/logger.util';
import {LogSeverity} from '../enum/log-severity.enum';

export class UserController {
  getMe = async (auth: Auth, cancelToken: CancelToken) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with AccessToken: ',
      args: auth.accessToken,
      callerInstance: this,
      callerMethod: 'getMe',
    });

    const bearer = 'Bearer ' + auth.accessToken;
    return await axios.get<any>(Config.Api.url + Config.Api.Endpoint.me, {
      cancelToken,
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: Config.Api.timeout,
      timeoutErrorMessage: Config.Api.timeoutErrorMessage,
    });
  };
}
