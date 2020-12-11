import { each } from '../helper/tools';
export var ErrorSource = {
  AGENT: 'agent',
  CONSOLE: 'console',
  NETWORK: 'network',
  SOURCE: 'source',
  LOGGER: 'logger'
};
export function formatUnknownError(stackTrace, errorObject, nonErrorPrefix) {
  if (!stackTrace || stackTrace.message === undefined && !(errorObject instanceof Error)) {
    return {
      message: nonErrorPrefix + '' + JSON.stringify(errorObject),
      stack: 'No stack, consider using an instance of Error',
      type: stackTrace && stackTrace.name
    };
  }

  return {
    message: stackTrace.message || 'Empty message',
    stack: toStackTraceString(stackTrace),
    type: stackTrace.name
  };
}
export function toStackTraceString(stack) {
  var result = stack.name || 'Error' + ': ' + stack.message;
  each(stack.stack, function (frame) {
    var func = frame.func === '?' ? '<anonymous>' : frame.func;
    var args = frame.args && frame.args.length > 0 ? '(' + frame.args.join(', ') + ')' : '';
    var line = frame.line ? ':' + frame.line : '';
    var column = frame.line && frame.column ? ':' + frame.column : '';
    result += '\n  at ' + func + args + ' @ ' + frame.url + line + column;
  });
  return result;
}