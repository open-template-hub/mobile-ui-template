import {Config} from '../config/app.config';
import {Auth} from '../interface/auth.interface';
import {PaymentArgs} from '../interface/payment-args.interface';
import axios from 'axios';
import { Logger } from '../util/logger.util';
import { LogSeverity } from '../enum/log-severity.enum';

export class PaymentController {
  saveSubscription = async (auth: Auth, args: PaymentArgs) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with args: ',
      args,
      callerInstance: this,
      callerMethod: 'saveSubscription',
    });
    
    const bearer = 'Bearer ' + auth.accessToken;
    return axios.post<any>(
      Config.Api.url + Config.Api.Endpoint.subscription,
      JSON.stringify(args),
      {
        headers: {
          Authorization: bearer,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
        timeoutErrorMessage: 'Request timed out',
      },
    );
  };
}
