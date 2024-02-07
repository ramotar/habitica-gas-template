// [Authors] These are the available log levels
// - They correspond to the functions of the console Class.
// - See https://developers.google.com/apps-script/reference/base/console
const LOG_DEBUG = 3;
const LOG_INFO = 2;
const LOG_WARN = 1;
const LOG_ERROR = 0;

// [Authors] Define the current log level
// - All messages of this level and below will be logged.
const LOG_LEVEL = LOG_INFO;

// [Authors] No need to edit below this point,
//   but feel free to have a look and tinker with it

/**
 * logDebug(formatOrObject, values)
 *
 * Wrapper for Google Apps Script's console.log(formatOrObject, values):
 * https://developers.google.com/apps-script/reference/base/console#log(Object,Object...)
 *
 * Writes the log message, if the current LOG_LEVEL is LOG_DEBUG.
 */
function logDebug(formatOrObject, ...values) {
  if (LOG_LEVEL >= LOG_DEBUG) {
    console.log(formatOrObject, ...values);
  }
}

/**
 * logInfo(formatOrObject, values)
 *
 * Wrapper for Google Apps Script's console.info(formatOrObject, values):
 * https://developers.google.com/apps-script/reference/base/console#info(Object,Object...)
 *
 * Writes the info message, if the current LOG_LEVEL is LOG_INFO.
 */
function logInfo(formatOrObject, ...values) {
  if (LOG_LEVEL >= LOG_INFO) {
    console.info(formatOrObject, ...values);
  }
}

/**
 * logWarning(formatOrObject, values)
 *
 * Wrapper for Google Apps Script's console.warn(formatOrObject, values):
 * https://developers.google.com/apps-script/reference/base/console#warn(Object,Object...)
 *
 * Writes the warning message, if the current LOG_LEVEL is LOG_WARN.
 */
function logWarning(formatOrObject, ...values) {
  if (LOG_LEVEL >= LOG_WARN) {
    console.warn(formatOrObject, ...values);
  }
}

/**
 * logError(formatOrObject, values)
 *
 * Wrapper for Google Apps Script's console.error(formatOrObject, values):
 * https://developers.google.com/apps-script/reference/base/console#error(Object,Object...)
 *
 * Writes the error message, if the current LOG_LEVEL is LOG_ERROR.
 */
function logError(formatOrObject, ...values) {
  if (LOG_LEVEL >= LOG_ERROR) {
    console.error(formatOrObject, ...values);
  }
}
