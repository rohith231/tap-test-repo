const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
  return `${timestamp} ${level}: ${message}`;
});

const levels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
}

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat,
  ),
  levels: levels,
  level: 'info',
  transports: [new transports.Console()],
});


module.exports = {
  info: (message) => {
    logger.info(message);
  },
  error: (message) => {
    logger.error(message);
  },
}
