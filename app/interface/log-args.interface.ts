/**
 * @description holds Log Args interface
 */

import {LogSeverity} from '../enum/log-severity.enum';

export interface LogArgs {
  /**
   * log severity
   */
  severity: LogSeverity;
  /**
   * log message
   */
  message: string;
  /**
   * log arguments
   */
  args?: any;
  /**
   * log caller instance if exist
   */
  callerInstance?: any;
  /**
   * log caller instance name, if you want to pass specific caller instance name
   */
  callerInstanceName?: string;
  /**
   * log caller method name, if you want to pass specific caller method name
   */
  callerMethod?: string;
}
