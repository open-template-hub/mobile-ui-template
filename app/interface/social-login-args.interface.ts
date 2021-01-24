import {SocialLoginType} from '../enum/social-login.enum';

export interface SocialLoginArgs {
  accessToken: string;
  tokenType: string;
  key: SocialLoginType;
}
