import {Config} from '../config/app.config';
import {Auth} from '../interface/auth.interface';
import {PaymentArgs} from '../interface/payment-args.interface';
import axios from 'axios';

export class PaymentController {
  saveSubscription = async (auth: Auth, args: PaymentArgs) => {
    const bearer = 'Bearer ' + auth.accessToken;
    return await axios.post<any>(
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
