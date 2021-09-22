import {Config} from '../config/app.config';
import {Auth} from '../interface/auth.interface';
import axios, {CancelToken} from 'axios';
import {Logger} from '../util/logger.util';
import {LogSeverity} from '../enum/log-severity.enum';
import {UserPayload} from '../interface/user-payload.interface';
import {File} from '../interface/file.interface';

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
    return axios.get<any>(Config.Api.url + Config.Api.Endpoint.me, {
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

  getProfileImage = async (
    profileImageId: number,
    cancelToken: CancelToken,
  ) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with profileImageId: ',
      args: profileImageId,
      callerInstance: this,
      callerMethod: 'getProfileImage',
    });

    return axios.get<any>(
      Config.Api.url +
        Config.Api.Endpoint.profileImageDownload +
        '?id=' +
        profileImageId.toString(),
      {
        cancelToken,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: Config.Api.timeout,
        timeoutErrorMessage: Config.Api.timeoutErrorMessage,
      },
    );
  };

  saveMe = async (auth: Auth, payload: UserPayload) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with Payload: ',
      args: payload,
      callerInstance: this,
      callerMethod: 'saveMe',
    });

    const bearer = 'Bearer ' + auth.accessToken;
    return axios.post<any>(
      Config.Api.url + Config.Api.Endpoint.me,
      JSON.stringify({payload}),
      {
        headers: {
          Authorization: bearer,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: Config.Api.timeout,
        timeoutErrorMessage: Config.Api.timeoutErrorMessage,
      },
    );
  };

  saveProfileImage = async (
    auth: Auth,
    image: string,
    contentType: string,
    username: string,
  ) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API',
      callerInstance: this,
      callerMethod: 'saveProfileImage',
    });

    const args = {
      key: Config.Api.fileServiceProvicerKey,
      payload: {
        title: username + '/profile_img',
        description: 'profile image',
        content_type: contentType,
        data: image,
        is_public: true,
      } as File,
    };

    const bearer = 'Bearer ' + auth.accessToken;

    const res = axios.post<any>(
      Config.Api.url + Config.Api.Endpoint.profileImageUpload,
      JSON.stringify(args),
      {
        headers: {
          Authorization: bearer,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: Config.Api.timeout,
        timeoutErrorMessage: Config.Api.timeoutErrorMessage,
      },
    );

    var response = await res;

    if (response.data && response.data.id) {
      return response.data.id;
    } else {
      return -1;
    }
  };

  updateMe = async (auth: Auth, payload: UserPayload) => {
    Logger.log({
      severity: LogSeverity.INFO,
      message: 'Calling API with Payload: ',
      args: payload,
      callerInstance: this,
      callerMethod: 'updateMe',
    });

    const bearer = 'Bearer ' + auth.accessToken;
    return axios.put<any>(
      Config.Api.url + Config.Api.Endpoint.me,
      JSON.stringify({payload}),
      {
        headers: {
          Authorization: bearer,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: Config.Api.timeout,
        timeoutErrorMessage: Config.Api.timeoutErrorMessage,
      },
    );
  };
}
