const MAIN_CONFIG = {
  ENABLE_LOGS: __DEV__,
};

class Logger {
  log = (...args: Array<any>) => {
    if (MAIN_CONFIG.ENABLE_LOGS) {
      console.log(...args);
    }
  };

  warn = (...args: Array<any>) => {
    if (MAIN_CONFIG.ENABLE_LOGS) {
      console.warn(...args);
    }
  };

  info = (...args: Array<any>) => {
    if (MAIN_CONFIG.ENABLE_LOGS) {
      console.info(...args);
    }
  };
  error = (...args: Array<any>) => {
    if (MAIN_CONFIG.ENABLE_LOGS) {
      console.error(...args);
    }
  };
}

const logger = new Logger();

export default logger;
