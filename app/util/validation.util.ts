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
    let found = regExp.test(name);
    return found;
  };

  validateEmail = (email: string) => {
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    let found = regExp.test(email);
    return found;
  };

  validatePassword = (password: string) => {
    const regExp = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
    );
    let found = regExp.test(password);
    return found;
  };
}
