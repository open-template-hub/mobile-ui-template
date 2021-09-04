/**
 * @description holds logger util
 */

import {LogSeverity} from '../enum/log-severity.enum';
import {LogArgs} from '../interface/log-args.interface';

class LoggerUtil {
  /**
   * Log
   * @param args log args
   */
  log = (args: LogArgs) => {
    try {
      if (!args.callerMethod) {
        try {
          throw new Error();
        } catch (e: any) {
          var re = /(\w+)@|at (\w+) \(/g,
            st = e.stack,
            m;

          m = re.exec(st);

          if (m) {
            args.callerMethod = m[1] || m[2];
          } else {
            args.callerMethod = 'NonSpecifiedMethod';
          }
        }
      }

      var callerType = 'NonSpecifiedClass';
      if (args.callerInstanceName) {
        callerType = args.callerInstanceName;
      } else if (args.callerInstance) {
        callerType = args.callerInstance.constructor.name;
      }

      console.log(
        `${args.severity} | ${callerType}::${args.callerMethod} => ${args.message}`,
        args.args ? args.args : '',
      );
    } catch (e) {
      console.log(
        `${LogSeverity.MINOR} | LoggerUtil::log => Unexpected error occurred while logging: `,
        e,
      );
    }
  };
}

export const Logger = new LoggerUtil();
