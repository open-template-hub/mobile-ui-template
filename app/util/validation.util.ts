import {AuthArgs} from '../interface/auth-args.interface';
import {ValidationResult} from '../interface/validation-result.interface';

export class Validation {
  validateSignUpArgs = (args: AuthArgs) => {
    let validationResult = {} as ValidationResult;
    validationResult.isUsernameValid = this.validateUserName(args.username);
    validationResult.isEmailValid = this.validateEmail(args.email);
    validationResult.isPasswordValid = this.validatePassword(args.password);
    return validationResult;
  };

  validateLoginArgs = (args: AuthArgs) => {
    let validationResult = {} as ValidationResult;
    validationResult.isEmailValid = this.validateEmail(args.email);
    validationResult.isPasswordValid = this.validatePassword(args.password);
    return validationResult;
  };

  validateUserName = (name: string) => {
    const regExp = /^[A-Za-z0-9]{6,}$/gm;
    return regExp.test(name);
  };

  validateEmail = (email: string) => {
    const regExp =
      /^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email);
  };

  validatePassword = (password: string) => {
    const regExp =
      /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
    return regExp.test(password);
  };
}
