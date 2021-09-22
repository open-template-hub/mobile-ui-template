import axios, {CancelToken} from 'axios';
import {Config} from '../config/app.config';
import {LogSeverity} from '../enum/log-severity.enum';
import {Auth} from '../interface/auth.interface';
import {Logger} from '../util/logger.util';

export class ProductController {
  getProducts = async (auth: Auth, cancelToken: CancelToken) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with AccessToken: ',
      args: auth.accessToken,
      callerInstance: this,
      callerMethod: 'getProducts',
    });

    const bearer = 'Bearer ' + auth.accessToken;
    return axios.get<any>(Config.Api.url + Config.Api.Endpoint.product, {
      cancelToken,
      headers: {
        Authorization: bearer,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: Config.Api.timeout,
      timeoutErrorMessage: Config.Api.timeoutErrorMessage,
    });
  };
}
